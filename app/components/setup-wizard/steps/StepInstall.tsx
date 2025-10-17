export default function StepInstall() {
  const handleInfrastructure = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await window.api.invoke('config-infrastructure')
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={handleInfrastructure}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Setup Infrastructure
      </button>
    </div>
  )
}
