interface Props {
    className?:string
}
const Spinner:React.FC<Props> = ({className = ''}) => {
    return (
        <div className={`spinner ${className}`}></div>
    )
}

export default Spinner;