import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
import { STORAGE_KEYS, ROUTES } from '../../constants';
import { usePermission } from '../../hooks/usePermission';
import './style.css';

const { Title, Text } = Typography;

interface LoginForm {
  username: string;
  password: string;
  remember?: boolean;
}

// 粒子动画组件
const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 粒子类
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#1890ff';
        ctx.fill();
        ctx.restore();
      }
    }

    // 创建粒子
    const particles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制粒子
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // 绘制连线
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = (100 - distance) / 100 * 0.2;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = '#1890ff';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshPermissions } = usePermission();

  // 检查是否已登录
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [navigate]);

  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      console.log('开始登录，用户名:', values.username);
      const response = await authApi.login(values);
      console.log('登录响应:', response);
      
      // 保存token和用户信息
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(response.data.adminInfo));
      
      console.log('登录成功，开始获取用户权限...');
      // 登录成功后立即获取用户权限
      await refreshPermissions();
      
      message.success('登录成功');
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      console.error('登录失败:', error);
      message.error(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ParticleBackground />
      
      <div className="login-content">
        {/* 左侧信息面板 */}
        <div className="login-info">
          <div className="info-content">
            <Title level={1} className="info-title">
              入舍管理系统
            </Title>
            <Text className="info-subtitle">
              家居轻改造小程序管理平台
            </Text>
            <div className="info-features">
              <div className="feature-item">
                <div className="feature-icon">🏠</div>
                <div className="feature-text">空间管理</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💡</div>
                <div className="feature-text">解决方案</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📦</div>
                <div className="feature-text">订单管理</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">👥</div>
                <div className="feature-text">用户管理</div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧登录表单 */}
        <div className="login-form-container">
          <Card className="login-card">
            <div className="login-header">
              <Title level={2}>管理员登录</Title>
              <Text type="secondary">请输入您的账号和密码</Text>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={handleLogin}
              autoComplete="off"
              size="large"
              className="login-form"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="用户名"
                  autoComplete="username"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="login-button"
                  block
                >
                  {loading ? '登录中...' : '登录'}
                </Button>
              </Form.Item>
            </Form>

            <div className="login-footer">
              <Text type="secondary">
                © 2025 入舍管理系统. All rights reserved.
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 