// import { UserRole } from '@prisma/client'
// import {
//   GetServerSideProps,
//   GetServerSidePropsContext,
//   GetServerSidePropsResult,
// } from 'next'
// import { getServerAuthSession } from '~/server/auth'

// export const allowRoles = (allowedRoles: UserRole[]) => {
//   return async function (
//     // ctx: GetServerSidePropsContext
//     getServerSideProps: GetServerSideProps | undefined
//   ) {
//     const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })

//     if (!session || !allowedRoles.includes(session.user.role))
//       return {
//         notFound: true,
//       }
//     return {
//       props: {
//         session,
//       },
//     }
//   }
// }
