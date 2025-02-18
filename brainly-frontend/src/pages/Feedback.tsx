import Button from "../components/Button";
import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Feedback submitted:", { feedback, email });
    setSubmitted(true);
  };

  return (
    <div>
      <Sidebar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md ml-60">
          <h2 className="text-2xl font-bold mb-6 text-center">
            We value your feedback
          </h2>
          {submitted ? (
            <div className="text-center flex justify-center items-center ">
              <p className="text-green-500 text-lg absolute -mt-15">
                Thank you for your feedback!
              </p>
              <div className="mt-8">
                <Button
                  variant="primary"
                  size="md"
                  text="Submit Another Feedback"
                  onClick={() => setSubmitted(false)}
                />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6  ">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="feedback"
                >
                  Your Feedback
                </label>
                <textarea
                  id="feedback"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Your Email (optional)
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex justify-center items-center mt-5">
                {" "}
                <Button variant="primary" size="md" text="Submit Feedback" />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
