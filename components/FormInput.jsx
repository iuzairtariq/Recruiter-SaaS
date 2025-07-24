export default function FormInput({ label, type = 'text', name, value, onChange }) {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-gray-700 mb-1">{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
        </div>
    );
}