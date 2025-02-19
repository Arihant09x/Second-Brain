interface InputOnchange {
  type: string;
  placeholder: string;
  refence?: React.Ref<HTMLInputElement>;
  onFocus?: React.Ref<HTMLInputElement>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValid?: boolean | null;
}

export function Input({
  type,
  placeholder,
  refence,
  value,
  onChange,
  isValid = null,
}: InputOnchange) {
  return (
    <div>
      <input
        placeholder={placeholder}
        type={type}
        className={`px-4 py-2 border-2 rounded m-2 ${
          isValid === null
            ? "border-gray-300"
            : isValid
              ? "border-green-500"
              : "border-red-500"
        }`}
        onFocus={() => {}}
        ref={refence}
        value={value}
        onChange={onChange}
      ></input>
    </div>
  );
}
