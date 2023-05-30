import { useAppContext } from '../../contextAPI/context'

const FlashMessage = () => {
    const { flash } = useAppContext()

    return (
        <div className={`alert alert-${flash.type}`}>{flash.message}</div>
    )
}
export default FlashMessage
