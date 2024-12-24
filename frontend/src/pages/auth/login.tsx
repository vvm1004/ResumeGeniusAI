import { Button, Divider, Form, Input, message, notification } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { callLogin } from "config/api";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserLoginInfo } from "@/redux/slice/accountSlide";
import styles from "styles/auth.module.scss";
import { useAppSelector } from "@/redux/hooks";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const callback = params?.get("callback");

  useEffect(() => {
    // Already logged in => redirect to '/'
    if (isAuthenticated) {
      // navigate('/');
      window.location.href = "/";
    }
  }, []);

  const onFinish = async (values: any) => {
    const { username, password } = values;
    setIsSubmit(true);
    const res = await callLogin(username, password);
    setIsSubmit(false);
    if (res?.data) {
      localStorage.setItem("access_token", res.data.access_token);
      dispatch(setUserLoginInfo(res.data.user));
      message.success("Login successful!");
      window.location.href = callback ? callback : "/";
    } else {
      notification.error({
        message: "An error occurred",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
  };

  return (
    <div className={styles["login-page"]}>
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.wrapper}>
            <div className={styles.heading}>
              <h2
                className={`${styles.text} text-2xl font-semibold text-center`}
              >
                Login with Resume Builder
              </h2>
              <Divider />
            </div>
            <Form
              name="basic"
              // style={{ maxWidth: 600, margin: '0 auto' }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label={<span className="text-md font-semibold">Email</span>}
                name="username"
                rules={[{ required: true, message: "Email is required!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label={<span className="text-md font-semibold">Password</span>}
                name="password"
                rules={[{ required: true, message: "Password is required!" }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
              // wrapperCol={{ offset: 6, span: 16 }}
              className="text-right"
              >
                <Button className="text-md px-4" type="primary" htmlType="submit" loading={isSubmit}>
                  Login
                </Button>
              </Form.Item>
              <Divider>Or</Divider>
              <p className="text-center">
                Don't have an account?
                <span className="font-bold text-lg hover:text-blue-600">
                  <Link to="/register"> Register </Link>
                </span>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
