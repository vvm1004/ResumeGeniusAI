import { Button, Divider, Form, Input, Row, Select, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from 'config/api';
import styles from 'styles/auth.module.scss';
import { IUser } from '@/types/backend';
const { Option } = Select;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values: IUser) => {
        const { name, email, password, age, gender, address } = values;
        setIsSubmit(true);
        const res = await callRegister(name, email, password as string, +age, gender, address);
        setIsSubmit(false);
        if (res?.data?._id) {
            message.success('Account registration successful!');
            navigate('/login')
        } else {
            notification.error({
                message: "An error occurred",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };

    return (
        <div className={styles["register-page"]} >

            <main className={styles.main} >
                <div className={styles.container} >
                    <section className={styles.wrapper} >
                        <div className={styles.heading} >
                            <h2 className={`${styles.text} text-2xl font-semibold text-center`}> Account Registration </h2>
                            <Divider />
                        </div>
                        <Form<IUser>
                            name="basic"
                            // style={{ maxWidth: 600, margin: '0 auto' }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label={<span className="text-md font-semibold">Full Name</span>}
                                name="name"
                                rules={[{ required: true, message: 'Full name is required!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label={<span className="text-md font-semibold">Email</span>}
                                name="email"
                                rules={[{ required: true, message: 'Email is required!' }]}
                            >
                                <Input type='email' />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label={<span className="text-md font-semibold">Password</span>}
                                name="password"
                                rules={[{ required: true, message: 'Password is required!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label={<span className="text-md font-semibold">Age</span>}
                                name="age"
                                rules={[{ required: true, message: 'Age is required!' }]}
                            >
                                <Input type='number' />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label={<span className="text-md font-semibold">Gender</span>}
                                rules={[{ required: true, message: 'Gender is required!' }]}
                            >
                                <Select
                                    allowClear
                                >
                                    <Option value="male">Male</Option>
                                    <Option value="female">Female</Option>
                                    <Option value="other">Other</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label={<span className="text-md font-semibold">Address</span>}
                                name="address"
                                rules={[{ required: true, message: 'Address is required!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item className='text-right'>
                                <Button className="text-md px-4" type="primary" htmlType="submit" loading={isSubmit} >
                                    Register
                                </Button>
                            </Form.Item>

                            <Divider> Or </Divider>
                            <p className="text-center"> Already have an account?
                                <span  className="font-bold text-lg hover:text-blue-600">
                                    <Link to='/login'> Login </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default RegisterPage;
