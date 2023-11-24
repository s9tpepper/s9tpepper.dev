export default function SignUp() {
  return (
    <form>
      <label htmlFor="firstName">First Name</label>
      <input id="firstName" name="firstName" type="text" required />
      <label htmlFor="lastName">Last Name</label>
      <input id="lastName" name="lastName" type="text" required />
      <label htmlFor="username">Username</label>
      <input id="username" name="username" type="text" required />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" required />
      <label htmlFor="confirmPassword">Confirm Password</label>
      <input id="confirmPassword" name="confirmPassword" type="password" required />
    </form>
  )
}
