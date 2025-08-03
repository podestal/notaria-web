import useUserInfoStore from "../../../../hooks/store/useGetUserInfo";

const LibroForm = () => {

    const user = useUserInfoStore(state => state.user);

  return (
    <div>
        <>{console.log('user', user)}</>
    </div>
  )
}

export default LibroForm