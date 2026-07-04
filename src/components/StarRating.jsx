export default function StarRating({ value, onChange, size = 'md' }) {
  const sizes = { sm: 'text-xl', md: 'text-2xl', lg: 'text-3xl' };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type={onChange ? 'button' : 'button'}
          onClick={() => onChange?.(star)}
          className={`${sizes[size]} transition-transform duration-150 ${onChange ? 'hover:scale-125 cursor-pointer' : 'cursor-default'}`}
        >
          <span className={star <= value ? 'text-primary-500' : 'text-stone-300 dark:text-stone-600'}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
