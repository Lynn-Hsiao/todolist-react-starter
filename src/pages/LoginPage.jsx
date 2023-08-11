import { useState, useEffect } from 'react';
import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
// import { login, checkPermission } from '../api/auth'; 使用useAuth()之後刪除
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth();

  const handleClick = async () => {
    const success = await login({
      username,
      password,
    });

    if (success) {
      // localStorage.setItem('authToken', authToken); //引入useAuth後刪除

      //登入成功訊息
      Swal.fire({
        position: 'top',
        title: '登入成功',
        timer: 2000,
        icon: 'success',
        showConfirmButton: false,
      });
      //導引至/todos頁面
      // navigate('/todos'); 引入useAuth後刪除;
      return;
    }

    //登入失敗訊息
    Swal.fire({
      position: 'top',
      title: '登入失敗',
      timer: 2000,
      icon: 'error',
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos');
    }
  }, [navigate, isAuthenticated]);

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>登入 Todo</h1>

      <AuthInputContainer>
        <AuthInput
          label="帳號"
          placeholder="請輸入帳號"
          value={username}
          onChange={(nameInputValue) => setUsername(nameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          type="password"
          label="密碼"
          placeholder="請輸入密碼"
          value={password}
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick}>登入</AuthButton>
      <AuthLinkText>註冊</AuthLinkText>
    </AuthContainer>
  );
};

export default LoginPage;

// userName: lynnlynn93555
// password: 12345678

//安裝SweetAlert2
//npm install sweetalert2@11.6.4
