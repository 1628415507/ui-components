/*
 * @Description:
 * @Date: 2024-11-14 15:36:48
 * @LastEditTime: 2024-11-14 15:42:54
 */
fetch('http://example.com/api/data', {
  credentials: 'include'
})
  .then((response) => response.text())
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
