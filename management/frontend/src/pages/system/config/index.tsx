import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  InputNumber,
  message,
  Tabs,
  Row,
  Col,
  Upload,
  Image,
  Divider,
  Space,
  Alert
} from 'antd';
import {
  SaveOutlined,
  ReloadOutlined,
  UploadOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import './style.css';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

interface SystemConfig {
  // 基础配置
  siteName: string;
  siteDescription: string;
  siteLogo: string;
  siteIcon: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  icp: string;
  
  // 邮件配置
  emailEnabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpSsl: boolean;
  emailFrom: string;
  emailFromName: string;
  
  // 存储配置
  storageType: string; // local, oss, cos
  localPath: string;
  ossEndpoint: string;
  ossAccessKeyId: string;
  ossAccessKeySecret: string;
  ossBucket: string;
  ossPath: string;
  
  // 系统配置
  systemMaintenance: boolean;
  maintenanceMessage: string;
  registrationEnabled: boolean;
  loginCaptcha: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  passwordComplexity: boolean;
}

const SystemConfigPage: React.FC = () => {
  const [basicForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [storageForm] = Form.useForm();
  const [systemForm] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  const [iconFileList, setIconFileList] = useState<UploadFile[]>([]);

  // 模拟配置数据
  const mockConfig: SystemConfig = {
    siteName: '入舍管理系统',
    siteDescription: '专业的家装管理平台',
    siteLogo: '/logo.png',
    siteIcon: '/favicon.ico',
    contactPhone: '400-123-4567',
    contactEmail: 'contact@rushe.com',
    address: '北京市朝阳区xxx街道xxx号',
    icp: '京ICP备12345678号',
    
    emailEnabled: true,
    smtpHost: 'smtp.qq.com',
    smtpPort: 587,
    smtpUsername: 'noreply@rushe.com',
    smtpPassword: '********',
    smtpSsl: true,
    emailFrom: 'noreply@rushe.com',
    emailFromName: '入舍管理系统',
    
    storageType: 'local',
    localPath: '/uploads',
    ossEndpoint: '',
    ossAccessKeyId: '',
    ossAccessKeySecret: '',
    ossBucket: '',
    ossPath: '',
    
    systemMaintenance: false,
    maintenanceMessage: '系统维护中，请稍后访问',
    registrationEnabled: true,
    loginCaptcha: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 6,
    passwordComplexity: false
  };

  // 保存基础配置
  const handleSaveBasicConfig = async () => {
    try {
      const values = await basicForm.validateFields();
      setLoading(true);
      
      // 这里应该调用保存API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('基础配置保存成功');
    } catch (error) {
      message.error('保存失败');
      console.error('保存基础配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 保存邮件配置
  const handleSaveEmailConfig = async () => {
    try {
      const values = await emailForm.validateFields();
      setLoading(true);
      
      // 这里应该调用保存API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('邮件配置保存成功');
    } catch (error) {
      message.error('保存失败');
      console.error('保存邮件配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 测试邮件配置
  const handleTestEmail = async () => {
    try {
      const values = await emailForm.validateFields();
      setTestingEmail(true);
      
      // 这里应该调用测试邮件API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success('测试邮件发送成功');
    } catch (error) {
      message.error('测试邮件发送失败');
      console.error('测试邮件失败:', error);
    } finally {
      setTestingEmail(false);
    }
  };

  // 保存存储配置
  const handleSaveStorageConfig = async () => {
    try {
      const values = await storageForm.validateFields();
      setLoading(true);
      
      // 这里应该调用保存API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('存储配置保存成功');
    } catch (error) {
      message.error('保存失败');
      console.error('保存存储配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 保存系统配置
  const handleSaveSystemConfig = async () => {
    try {
      const values = await systemForm.validateFields();
      setLoading(true);
      
      // 这里应该调用保存API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('系统配置保存成功');
    } catch (error) {
      message.error('保存失败');
      console.error('保存系统配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 文件上传处理
  const handleLogoUpload = (info: any) => {
    setLogoFileList(info.fileList);
    if (info.file.status === 'done') {
      message.success('Logo上传成功');
    } else if (info.file.status === 'error') {
      message.error('Logo上传失败');
    }
  };

  const handleIconUpload = (info: any) => {
    setIconFileList(info.fileList);
    if (info.file.status === 'done') {
      message.success('图标上传成功');
    } else if (info.file.status === 'error') {
      message.error('图标上传失败');
    }
  };

  useEffect(() => {
    // 初始化表单数据
    basicForm.setFieldsValue(mockConfig);
    emailForm.setFieldsValue(mockConfig);
    storageForm.setFieldsValue(mockConfig);
    systemForm.setFieldsValue(mockConfig);
  }, []);

  return (
    <div className="system-config-page">
      <Tabs defaultActiveKey="basic">
        <TabPane tab="基础配置" key="basic">
          <Card title="基础信息配置">
            <Form
              form={basicForm}
              layout="vertical"
              onFinish={handleSaveBasicConfig}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="siteName"
                    label="网站名称"
                    rules={[{ required: true, message: '请输入网站名称' }]}
                  >
                    <Input placeholder="请输入网站名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="contactPhone"
                    label="联系电话"
                  >
                    <Input placeholder="请输入联系电话" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="siteDescription"
                label="网站描述"
              >
                <TextArea rows={3} placeholder="请输入网站描述" />
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="contactEmail"
                    label="联系邮箱"
                    rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}
                  >
                    <Input placeholder="请输入联系邮箱" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="icp"
                    label="ICP备案号"
                  >
                    <Input placeholder="请输入ICP备案号" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="address"
                label="联系地址"
              >
                <Input placeholder="请输入联系地址" />
              </Form.Item>

              <Divider>网站图标</Divider>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="网站Logo">
                    <Upload
                      listType="picture-card"
                      fileList={logoFileList}
                      onChange={handleLogoUpload}
                      beforeUpload={() => false}
                    >
                      {logoFileList.length < 1 && (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>上传Logo</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="网站图标">
                    <Upload
                      listType="picture-card"
                      fileList={iconFileList}
                      onChange={handleIconUpload}
                      beforeUpload={() => false}
                    >
                      {iconFileList.length < 1 && (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>上传图标</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                  >
                    保存配置
                  </Button>
                  <Button icon={<ReloadOutlined />}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="邮件配置" key="email">
          <Card title="邮件服务配置">
            <Alert
              message="邮件配置说明"
              description="配置SMTP服务器信息，用于发送系统邮件通知。建议使用企业邮箱或专业邮件服务。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />
            
            <Form
              form={emailForm}
              layout="vertical"
              onFinish={handleSaveEmailConfig}
            >
              <Form.Item
                name="emailEnabled"
                label="启用邮件服务"
                valuePropName="checked"
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="smtpHost"
                    label="SMTP服务器"
                    rules={[{ required: true, message: '请输入SMTP服务器' }]}
                  >
                    <Input placeholder="如：smtp.qq.com" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="smtpPort"
                    label="SMTP端口"
                    rules={[{ required: true, message: '请输入SMTP端口' }]}
                  >
                    <InputNumber
                      placeholder="如：587"
                      style={{ width: '100%' }}
                      min={1}
                      max={65535}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="smtpUsername"
                    label="SMTP用户名"
                    rules={[{ required: true, message: '请输入SMTP用户名' }]}
                  >
                    <Input placeholder="请输入SMTP用户名" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="smtpPassword"
                    label="SMTP密码"
                    rules={[{ required: true, message: '请输入SMTP密码' }]}
                  >
                    <Input.Password
                      placeholder="请输入SMTP密码"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="smtpSsl"
                label="启用SSL/TLS"
                valuePropName="checked"
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="emailFrom"
                    label="发件人邮箱"
                    rules={[
                      { required: true, message: '请输入发件人邮箱' },
                      { type: 'email', message: '请输入正确的邮箱格式' }
                    ]}
                  >
                    <Input placeholder="请输入发件人邮箱" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="emailFromName"
                    label="发件人名称"
                  >
                    <Input placeholder="请输入发件人名称" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                  >
                    保存配置
                  </Button>
                  <Button
                    onClick={handleTestEmail}
                    loading={testingEmail}
                  >
                    测试邮件
                  </Button>
                  <Button icon={<ReloadOutlined />}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="存储配置" key="storage">
          <Card title="文件存储配置">
            <Alert
              message="存储配置说明"
              description="配置文件存储方式，支持本地存储、阿里云OSS、腾讯云COS等。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />
            
            <Form
              form={storageForm}
              layout="vertical"
              onFinish={handleSaveStorageConfig}
            >
              <Form.Item
                name="storageType"
                label="存储类型"
                rules={[{ required: true, message: '请选择存储类型' }]}
              >
                <Select placeholder="请选择存储类型">
                  <Option value="local">本地存储</Option>
                  <Option value="oss">阿里云OSS</Option>
                  <Option value="cos">腾讯云COS</Option>
                </Select>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.storageType !== currentValues.storageType
                }
              >
                {({ getFieldValue }) => {
                  const storageType = getFieldValue('storageType');
                  
                  if (storageType === 'local') {
                    return (
                      <Form.Item
                        name="localPath"
                        label="本地存储路径"
                        rules={[{ required: true, message: '请输入本地存储路径' }]}
                      >
                        <Input placeholder="如：/uploads" />
                      </Form.Item>
                    );
                  }
                  
                  if (storageType === 'oss') {
                    return (
                      <>
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item
                              name="ossEndpoint"
                              label="OSS Endpoint"
                              rules={[{ required: true, message: '请输入OSS Endpoint' }]}
                            >
                              <Input placeholder="如：oss-cn-hangzhou.aliyuncs.com" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="ossBucket"
                              label="OSS Bucket"
                              rules={[{ required: true, message: '请输入OSS Bucket' }]}
                            >
                              <Input placeholder="请输入OSS Bucket名称" />
                            </Form.Item>
                          </Col>
                        </Row>
                        
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item
                              name="ossAccessKeyId"
                              label="Access Key ID"
                              rules={[{ required: true, message: '请输入Access Key ID' }]}
                            >
                              <Input placeholder="请输入Access Key ID" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="ossAccessKeySecret"
                              label="Access Key Secret"
                              rules={[{ required: true, message: '请输入Access Key Secret' }]}
                            >
                              <Input.Password placeholder="请输入Access Key Secret" />
                            </Form.Item>
                          </Col>
                        </Row>
                        
                        <Form.Item
                          name="ossPath"
                          label="OSS路径前缀"
                        >
                          <Input placeholder="如：uploads/" />
                        </Form.Item>
                      </>
                    );
                  }
                  
                  return null;
                }}
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                  >
                    保存配置
                  </Button>
                  <Button icon={<ReloadOutlined />}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="系统配置" key="system">
          <Card title="系统安全配置">
            <Form
              form={systemForm}
              layout="vertical"
              onFinish={handleSaveSystemConfig}
            >
              <Divider>系统维护</Divider>
              
              <Form.Item
                name="systemMaintenance"
                label="系统维护模式"
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>

              <Form.Item
                name="maintenanceMessage"
                label="维护提示信息"
              >
                <TextArea rows={3} placeholder="请输入维护提示信息" />
              </Form.Item>

              <Divider>用户注册</Divider>
              
              <Form.Item
                name="registrationEnabled"
                label="允许用户注册"
                valuePropName="checked"
              >
                <Switch checkedChildren="允许" unCheckedChildren="禁止" />
              </Form.Item>

              <Divider>登录安全</Divider>
              
              <Form.Item
                name="loginCaptcha"
                label="登录验证码"
                valuePropName="checked"
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="sessionTimeout"
                    label="会话超时时间（分钟）"
                    rules={[{ required: true, message: '请输入会话超时时间' }]}
                  >
                    <InputNumber
                      placeholder="请输入会话超时时间"
                      style={{ width: '100%' }}
                      min={5}
                      max={1440}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="maxLoginAttempts"
                    label="最大登录尝试次数"
                    rules={[{ required: true, message: '请输入最大登录尝试次数' }]}
                  >
                    <InputNumber
                      placeholder="请输入最大登录尝试次数"
                      style={{ width: '100%' }}
                      min={3}
                      max={10}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider>密码策略</Divider>
              
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="passwordMinLength"
                    label="密码最小长度"
                    rules={[{ required: true, message: '请输入密码最小长度' }]}
                  >
                    <InputNumber
                      placeholder="请输入密码最小长度"
                      style={{ width: '100%' }}
                      min={6}
                      max={20}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="passwordComplexity"
                    label="密码复杂度要求"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                  >
                    保存配置
                  </Button>
                  <Button icon={<ReloadOutlined />}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SystemConfigPage; 