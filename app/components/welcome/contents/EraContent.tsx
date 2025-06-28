import ContentStep from '../ContentStep'
import CodeWindowIcon from '../icons/CodeWindowIcon'
import FanIcon from '../icons/FanIcon'
import ColorSchemeIcon from '../icons/ColorSchemeIcon'
import AsterikIcon from '../icons/AsterikIcon'

const EraContent = () => {
  return (
    <div>
      <h2 className="flex items-center gap-4">
        One Click Teach App
        <div className="p-1 rounded-md bg-primary/10">
          <img src="res://icons/OneClickTeach_Circle.svg" className="w-4 h-4" />
        </div>
      </h2>
      <p>
        Welcome to the One Click Teach App!.
      </p>

      <div className="welcome-content-steps">
        <ContentStep
          title="Custom Window Titlebar & Menus"
          description="Customize the look and feel of the application window"
          icon={CodeWindowIcon}
        />

        <ContentStep
          title="Lightning Fast HMR"
          description="Hot Module Replacement that stays fast regardless of app size"
          icon={FanIcon}
        />

        <ContentStep
          title="Dark & Light Mode"
          description="Switch between dark and light mode with a click of a button"
          icon={ColorSchemeIcon}
        />

        <ContentStep
          title="Shadcn UI + Tailwind"
          description="A collection of re-usable components built with Shadcn UI"
          icon={AsterikIcon}
        />
      </div>

      <p className="learn-more">
        Learn more about One Click Teach App at{' '}
        <a href="https://github.com/oneclickteach/oneclickteach-home" target="_blank" rel="noreferrer">
          github.com
        </a>
      </p>
    </div>
  )
}

export default EraContent
