import { formatTime } from '../utils/helpers';

export default function ChatBubble({ message, isMe }) {
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
        isMe 
          ? 'bg-primary-600 text-white rounded-br-md' 
          : 'bg-slate-100 text-slate-800 rounded-bl-md'
      }`}>
        <p className="text-sm leading-relaxed">{message.text}</p>
        <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-[10px] ${isMe ? 'text-primary-200' : 'text-slate-400'}`}>
            {formatTime(message.timestamp)}
          </span>
          {isMe && (
            <span className="text-[10px] text-primary-200">
              {message.read ? 'Read' : 'Sent'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
