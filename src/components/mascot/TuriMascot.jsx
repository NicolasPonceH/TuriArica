import React from 'react';
import { Mascot } from 'page-mascot';

/**
 * TuriMascot - Envoltorio de page-mascot configurado para el asistente turístico de Arica.
 * Sigue la posición del cursor dinámicamente y responde a clics con animaciones y expresiones.
 */
export default function TuriMascot({
  size = 80,
  className = '',
  label = 'Momita, asistente de Arica',
  onClick,
  directions = '/images/mascot-directions.png?v=4',
  reactions = '/images/mascot-reactions.png?v=4',
  ariaLabel
}) {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex items-center justify-center select-none transition-transform duration-200 ${className}`}
      aria-label={ariaLabel || label}
    >
      <Mascot
        directions={directions}
        reactions={reactions}
        size={size}
        label={label}
      />
    </div>
  );
}
