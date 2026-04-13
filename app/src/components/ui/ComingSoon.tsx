import React from "react";

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <div className="flex items-center justify-center">
            <p className="text-[90px] font-bold text-blue-600 mb-4">🚧</p>
        </div>
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        ¡Estamos trabajando en este módulo!
      </h1>
      <p className="text-lg text-gray-600 max-w-lg">
        Esta funcionalidad aún no está disponible. Nuestro equipo está
        trabajando para ofrecerte la mejor experiencia posible. 
        <span className="font-semibold"> ¡Pronto estará lista! 🚀</span>
      </p>
    </div>
  );
};

export default ComingSoon;
