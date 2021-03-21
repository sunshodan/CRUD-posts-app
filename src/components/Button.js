import react, { useState } from "react";

const Button = () => {
  const [btn, setBtn] = useState("Like");
  const buttonHandler = () => {
    if ({ btn } === "Like") {
      setBtn("Dislike");
    } else {
      setBtn("Like");
    }
  };
  return (
    <div className="Button-container">
      <button onClick={buttonHandler}>{btn}</button>
    </div>
  );
};
export default Button;
