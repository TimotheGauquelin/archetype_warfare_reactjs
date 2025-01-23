const useToken = () => {
  return (
    window.localStorage.getItem('token')
  )
}

export default useToken