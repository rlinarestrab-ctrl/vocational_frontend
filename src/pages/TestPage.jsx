import React, { useState } from "react";
import TestList from "../components/Tests/TestList";
import TestDetail from "../components/Tests/TestDetail";
import TestResult from "../components/Tests/TestResult";

export default function TestPage({ token, me }) {
  const [step, setStep] = useState("list");
  const [testResult, setTestResult] = useState(null);
  const [finalResult, setFinalResult] = useState(null);

  const handleStart = (result) => {
    setTestResult(result);
    setStep("detail");
  };

  const handleFinish = (result) => {
    setFinalResult(result);
    setStep("result");
  };

  const handleRestart = () => {
    setStep("list");
    setTestResult(null);
    setFinalResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded shadow">
      {step === "list" && <TestList token={token} me={me} onStart={handleStart} />}
      {step === "detail" && <TestDetail token={token} testResult={testResult} onFinish={handleFinish} />}
      {step === "result" && <TestResult result={finalResult} onRestart={handleRestart} />}
    </div>
  );
}
