import { MODEL } from "../constant"

export default function ModelSelector({ onChange, defaultLanguage }) {
  return (
    <div className=''>
      <label className="font-bold">Model: </label>
      <select onChange={onChange} defaultValue={defaultLanguage}>
        {Object.entries(MODEL).map(([key, value]) => {
          return <option key={key} value={value}>{value}</option>
        })}
      </select>
    </div>
  )
}

