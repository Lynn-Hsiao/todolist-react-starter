import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useEffect, useState } from 'react';
// import { checkPermission, register } from '../api/auth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { register, isAuthenticated } = useAuth();

  const handleClick = async () => {
    if (username.length === 0) {
      return;
    }
    if (email.length === 0) {
      return;
    }
    if (password.length === 0) {
      return;
    }

    const success = await register({
      username,
      email,
      password,
    });

    if (success) {
      // localStorage.setItem('authToken', authToken);

      //註冊成功訊息
      Swal.fire({
        position: 'top',
        title: '註冊成功',
        timer: 2000,
        icon: 'success',
        showConfirmButton: false,
      });
      //導引至/todos頁面
      // navigate('/todos');
      return;
    }

    //註冊失敗訊息
    Swal.fire({
      position: 'top',
      title: '註冊失敗',
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

  // useEffect(()=>{}, []) 的dependency[] 是何用意?

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>建立您的帳號</h1>

      <AuthInputContainer>
        <AuthInput
          label="帳號"
          placeholder="請輸入帳號"
          value={username}
          onChange={(userNameInputValue) => setUsername(userNameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          type="email"
          label="E-mail"
          placeholder="請輸入E-mail"
          value={email}
          onChange={(emailInputValue) => setEmail(emailInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          label="密碼"
          placeholder="請輸入密碼"
          value={password}
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick}>註冊</AuthButton>
      <AuthLinkText>取消</AuthLinkText>
    </AuthContainer>
  );
};

export default SignUpPage;
