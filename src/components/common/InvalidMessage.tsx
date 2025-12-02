import React from 'react';

interface InvalidIdMessageProps {
  title?: string;
  message?: string;
}

const InvalidIdMessage: React.FC<InvalidIdMessageProps> = ({
  title = "ID Tidak Valid",
  message = "URL yang Anda akses memiliki format ID yang salah atau tidak ditemukan. Mohon periksa kembali tautannya.",
}) => {
  return (
    <div className="p-8 text-center bg-error-50 dark:bg-error-900 rounded-lg">
      <h2 className="text-xl font-bold text-error-800 dark:text-error-100">{title}</h2>
      <p className="text-error-700 dark:text-error-200">
        {message}
      </p>
    </div>
  );
};

export default InvalidIdMessage;

