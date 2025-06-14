import MessageItem from "./MessageItem";
import LoadingIndicator from "./LoadingIndicator";

export default function MessageList({ conversa, carregando, mensagensRef }) {
  return (
    <div
      ref={mensagensRef}
      className="flex-1 p-4 overflow-y-auto space-y-6 max-w-4xl w-full mx-auto pb-32"
    >
      {conversa.map((msg, index) => (
        <MessageItem key={index} msg={msg} />
      ))}
      {carregando && <LoadingIndicator />}
    </div>
  );
}
