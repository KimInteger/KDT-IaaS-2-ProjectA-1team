export const SettingStyles = {
  contentStyle: `
    flex
    h-screen
    relative
  `,
  button: `
    px-4 
    py-2 
    rounded-lg 
    hover:bg-gray-700 
    active:bg-gray-600 
    focus:outline-none 
    focus:ring-2 
    focus:ring-gray-500 
    transition-all 
    duration-200
    cursor-pointer
  `,
  modalBackdrop: `
    fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center
  `,
  modalContent: `
    bg-white p-4 rounded shadow-lg w-full max-w-sm
  `,
  selectBox: `
    mt-2
    px-3
    py-2
    border border-gray-300
    rounded-lg
    shadow-sm
    focus:outline-none
    focus:ring-2
    focus:ring-gray-500
    transition-all
    duration-200
    w-full
  `,
  // Add other styles as needed
};
