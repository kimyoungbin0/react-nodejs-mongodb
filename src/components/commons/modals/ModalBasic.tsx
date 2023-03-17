import { Modal } from "antd";
import { useEffect, useState } from "react";

interface ModalBasicProps {
  open: boolean;
}

export default function ModalBasic({ open }: ModalBasicProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const showModal = () => {
    setIsOpen(true);
  };

  const handleOk = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={showModal}>모달창 열기!!</button>
      <Modal title="모달 제목" open={isOpen} onOk={handleOk} onCancel={handleCancel}>
        비밀번호 입력: <input type="password" />
      </Modal>
    </>
  );
}
