interface ButtonProps {
  text: string;
  onClick: () => void;
}

export function Button({ text, onClick }: ButtonProps) {
  return <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded">{text}</button>;
}
