import styled from "@emotion/styled";

export const page = styled.div`
  position: absolute;
  top: 50%;
  left: 60%;
  width: 100%;
  max-width: 500px;
  padding: 0 20px;

  transform: translate(-50%, -50%);

  background-color: white;

  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 4px solid #f0f0f0;
`;

export const titleWrap = styled.div`
  margin-top: 50px;
  width: 100%;
  height: 60px;
  color: #262626;
  text-align: center;
  background-image: url("/images/logo.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

export const contentWrap = styled.div`
  margin-top: 26px;
  flex: 1;
`;

export const inputTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #262626;
`;

export const registerTitle = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #262626;
  margin-top: 15px;
`;

export const inputWrap = styled.div`
  display: flex;
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
  background-color: #f7f7f7;
  border: 1px solid #e2e0e0;
  margin-bottom: 20px;
`;

export const input = styled.input`
  width: 100%;
  outline: none;
  border: none;
  height: 17px;
  font-size: 14px;
  font-weight: 400;
  background-color: #f7f7f7;
`;

export const bottomButton = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  font-weight: bold;
  border-radius: 64px;
  background-color: #77a7ff;
  color: white;

  cursor: pointer;
`;

export const checkButton = styled.button`
  display: flex;
  width: 20%;
  height: 48px;
  border: none;
  font-weight: bold;
  border-radius: 5px;
  background-color: #77a7ff;
  color: white;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  /* For right alignment */
  margin-left: auto;
`;

export const errorMessageWrap = styled.div`
  margin-top: 8px;
  color: #ef0000;
  font-size: 12px;
`;

export const signup = styled.a`
  text-align: right;
  margin-bottom: 10px;
  color: #77a7ff;
`;

export const alertWrap = styled.div`
  text-align: center;
  width: 100%;
  margin-top: 16px;
  margin-bottom: 16px;
`;
