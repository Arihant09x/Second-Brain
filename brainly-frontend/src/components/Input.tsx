interface InputOnchange {
  type: string;
  placeholder: string;
  refence?: React.Ref<HTMLInputElement>;
  onFocus?: React.Ref<HTMLInputElement>;
  value?: string;
}
export function Input({ type, placeholder, refence, value }: InputOnchange) {
  return (
    <div>
      <input
        placeholder={placeholder}
        type={type}
        className="px-4 py-2 border-2 rounded m-2"
        onFocus={placeholder}
        ref={refence}
        value={value}
      ></input>
    </div>
  );
}
