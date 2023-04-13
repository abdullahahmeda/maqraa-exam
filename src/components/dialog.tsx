import { Transition, Dialog as HeadlessDialog } from '@headlessui/react'
import { Fragment, ReactNode } from 'react'
import { MdClose } from 'react-icons/md'

export const DialogActions = ({ children }: { children: ReactNode }) => {
  return <div className='-mx-6 -mb-4 flex bg-gray-50 py-3 px-4'>{children}</div>
}

type Props = {
  open: boolean
  setOpen: any
  title?: string
  children: ReactNode
}

export default function Dialog ({ open, setOpen, title, children }: Props) {
  const closeDialog = () => setOpen(false)
  return (
    <Transition.Root show={open} as={Fragment}>
      <HeadlessDialog as='div' className='relative z-10' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-[100] overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <HeadlessDialog.Panel
                as='div'
                className='relative w-full transform overflow-hidden rounded-lg bg-white text-right shadow-xl transition-all sm:my-8 sm:max-w-lg'
              >
                <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                  <div className='mb-4 flex items-center justify-between'>
                    <HeadlessDialog.Title
                      as='h3'
                      className='text-base font-semibold leading-6 text-gray-900'
                    >
                      {title}
                    </HeadlessDialog.Title>
                    <button
                      type='button'
                      onClick={closeDialog}
                      className='text-gray-600 hover:text-gray-700'
                    >
                      <MdClose size={20} />
                    </button>
                  </div>
                  <div>{children}</div>
                </div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition.Root>
  )
}
