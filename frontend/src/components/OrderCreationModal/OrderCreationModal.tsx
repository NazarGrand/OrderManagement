import { FunctionComponent, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import styles from "./OrderCreationModal.module.scss";
import imgCloseModal from "../../assets/closeModal.svg";
import { User } from "../../common/interfaces/User";
import { Product } from "../../common/interfaces/Product";
import { OrderRequest } from "../../common/interfaces/OrderRequest";
import { createOrder } from "../../services/OrderService";
import axios from "axios";

interface OrderCreationModalProps {
  onClose: () => void;
  users: User[] | undefined;
  selectedUser: User | undefined;
  products: Product[] | undefined;
  fetchUserOrders: (userId: string) => Promise<void>;
  setSelectedUser: (user: User) => void;
}

interface ErrorResponse {
  message: string;
}

const OrderCreationModal: FunctionComponent<OrderCreationModalProps> = ({
  onClose,
  users,
  selectedUser,
  setSelectedUser,
  products,
  fetchUserOrders,
}) => {
  const [apiError, setApiError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validationSchema = yup.object({
    userId: yup.string().required("User is required"),
    productId: yup.string().required("Product is required"),
    quantity: yup
      .number()
      .required("Quantity is required")
      .min(1, "Quantity must be at least 1"),
  });

  const submit = async (values: OrderRequest) => {
    try {
      setIsLoading(true);
      await createOrder(values);

      const user = users?.find((user) => user.id === values.userId);
      setSelectedUser(user!);
      fetchUserOrders(values.userId!);

      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const responseData = error.response.data as ErrorResponse;
        setApiError(responseData.message || "Server Error. Please try again!");
      } else {
        setApiError("Server Error. Please try again!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik<OrderRequest>({
      initialValues: {
        userId: selectedUser?.id || users?.[0].id,
        productId: products?.[0]?.id,
        quantity: 1,
      },
      validationSchema,
      onSubmit: (values) => submit(values),
    });

  return (
    <div className={styles.modalWrapper}>
      <button
        type="button"
        onClick={onClose}
        className={styles.modalBackground}
        aria-label="close modal"
      />
      <section className={styles.modalWindow}>
        <p className={styles.titleModalWindow}>User Order Creation Form</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <section className={styles.formSection}>
            <section className={styles.elementForm}>
              <label htmlFor="userId" className={styles.labelForm}>
                User:
              </label>
              <select
                id="userId"
                name="userId"
                value={values.userId}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {users?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {touched.userId && errors.userId && (
                <p className={styles.errorMessage}>{errors.userId}</p>
              )}
            </section>

            <section className={styles.elementForm}>
              <label htmlFor="productId" className={styles.labelForm}>
                Product:
              </label>
              <select
                id="productId"
                name="productId"
                value={values.productId}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {products?.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {touched.productId && errors.productId && (
                <p className={styles.errorMessage}>{errors.productId}</p>
              )}
            </section>

            <section className={styles.elementForm}>
              <label htmlFor="quantity" className={styles.labelForm}>
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={values.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                className={styles.inputQuantity}
              />
              {touched.quantity && errors.quantity && (
                <p className={styles.errorMessage}>{errors.quantity}</p>
              )}
            </section>
          </section>

          <section className={styles.apiError}>
            <p className={styles.apiErrorMessage}>{apiError}</p>
          </section>
          <button
            type="submit"
            className={styles.submitForm}
            disabled={isLoading}
          >
            {isLoading ? <div className={styles.loader} /> : "Create Order"}
          </button>
        </form>

        <button
          type="button"
          aria-label="close modal"
          className={styles.closeModal}
          onClick={onClose}
        >
          <img src={imgCloseModal} alt="close Modal" />
        </button>
      </section>
    </div>
  );
};

export default OrderCreationModal;
