// 'use client'

// import { useCallback, useEffect, useState } from 'react'
// import {
//   EmailStatisticsPaginatedResponse,
//   EmailStatisticsResponse
// } from '@/types'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { format } from 'date-fns'
// import {
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signOut,
//   User
// } from 'firebase/auth'
// import Pagination from 'rc-pagination'
// import DatePicker from 'react-datepicker'
// import { useForm } from 'react-hook-form'
// import { toast } from 'sonner'
// import * as z from 'zod'

// import { getConfigByType } from '@/lib/db/configuration'
// import { getDemoData } from '@/lib/db/demo'
// import {
//   EmailStatsArgs,
//   EmailStatsEnv,
//   EmailStatsEventType,
//   getEmailStatistics
// } from '@/lib/db/email'
// import { getFirebaseAuth } from '@/lib/firebase/auth/firebase'
// import { Button } from '@/components/ui/button'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { LogoutButton } from '@/components/shared/logout'

// const formSchema = z.object({
//   email: z.string().email({
//     message: 'Please enter a valid email address'
//   }),
//   password: z.string()
// })

// enum ADMIN_PORTAL_SCREEN {
//   LOGIN = 'LOGIN',
//   SEARCH = 'SEARCH',
//   STATISTICS = 'STATISTICS',
//   DEMO = 'DEMO'
// }

// const DEFAULT_STATS_PARAMS = {
//   eventType: 'Open',
//   env: 'DEV',
//   page: 0,
//   size: 20,
//   sentAt: format(new Date(), 'yyyy-MM-dd')
//   // templateCode: 'NOT_MIGRATED'
// } as EmailStatsArgs

// const AdminPortal = () => {
//   const [isLoading, setIsLoading] = useState<boolean | null>(null)
//   const [screen, setScreen] = useState<ADMIN_PORTAL_SCREEN | null>(null)

//   // search
//   const [searchQuery, setSearchQuery] = useState('')
//   const [organizations, setOrganizations] = useState([])
//   const [token, setToken] = useState('')

//   // statistics
//   const [date, setDate] = useState(new Date())
//   const [date2, setDate2] = useState(new Date())
//   const [emailStats, setEmailStats] = useState<{
//     data: EmailStatisticsPaginatedResponse | null
//     error: null | string
//   } | null>(null)
//   const [demoStats, setDemoStats] = useState<{
//     data: any
//     error: null | string
//   } | null>(null)
//   const [statsParams, setStatsParams] =
//     useState<EmailStatsArgs>(DEFAULT_STATS_PARAMS)

//   useEffect(() => {
//     const auth = getFirebaseAuth()
//     onAuthStateChanged(auth, (user: User | null) => {
//       if (user) {
//         setScreen(ADMIN_PORTAL_SCREEN.SEARCH)
//       } else {
//         resetValues()
//       }
//     })
//   }, [])

//   const resetValues = () => {
//     setDate(new Date())
//     setScreen(ADMIN_PORTAL_SCREEN.LOGIN)
//     setSearchQuery('')
//     setStatsParams(DEFAULT_STATS_PARAMS)
//     setEmailStats({
//       data: null,
//       error: null
//     })

//     setDemoStats({
//       data: null,
//       error: null
//     })
//     setOrganizations([])
//   }

//   useEffect(() => {
//     const auth = getFirebaseAuth()
//     if (auth.currentUser) {
//       auth.currentUser
//         .getIdToken(/* forceRefresh */ false)
//         .then((token) => {
//           setToken(token)
//         })
//         .catch((error) => {
//           console.error('Error fetching ID token:', error)
//           resetValues()
//         })
//     } else {
//       console.error('No user authenticated.')
//       resetValues()
//     }
//   }, [])

//   const handleLogin = async ({
//     email,
//     password
//   }: {
//     email: string
//     password: string
//   }) => {
//     setIsLoading(true)
//     try {
//       const auth = getFirebaseAuth()
//       const result = await signInWithEmailAndPassword(auth, email, password)
//       const idTokenResult = await result.user.getIdTokenResult()

//       setToken(idTokenResult.token)
//       await fetch('/api/login', {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${idTokenResult.token}`
//         }
//       })
//       // const { token, user } = await getServerUser()
//       const getConfiguration = await getConfigByType('ACCESS_CONTROL')
//       const findUser = getConfiguration?.find((user) => user?.value === email)
//       if (findUser && findUser?.active) {
//         // router.push('/admin-portal/search')
//         setScreen(ADMIN_PORTAL_SCREEN.SEARCH)
//       } else {
//         const auth = getFirebaseAuth()
//         await signOut(auth)
//         await fetch('/api/logout', {
//           method: 'GET'
//         })
//         resetValues()
//         throw new Error('Firebase: Error (auth/wrong-password).')
//       }
//     } catch (error: any) {
//       if (error.message === 'Firebase: Error (auth/user-not-found).') {
//         toast.error('User Doesn`t exist, Create a new account')
//       } else if (error.message === 'Firebase: Error (auth/wrong-password).') {
//         showCustomToast('Error', 'This is not a user with ACCESS_CONTROL Config Type', 'error', 5000)
//       } else if (
//         error.message ===
//         'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).'
//       ) {
//         showCustomToast('Error', 'Too many login attempts, please try after few minutes.', 'error', 5000)
//       } else {
//         showCustomToast('Error', 'Something went wrong, please try again.', 'error', 5000)
//       }
//       resetValues()
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: '',
//       password: ''
//     }
//   })

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     await handleLogin(values)
//   }

//   const handleSearchSubmit = async () => {
//     try {
//       const response = await fetch(
//         `/api/admin-portal-search?searchQuery=${searchQuery}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       )
//       if (!response.ok) {
//         throw new Error('Failed to fetch organizations')
//       }

//       const data = await response.json()
//       setOrganizations(data?.searchResponse?.content)
//     } catch (error: any) {
//       showCustomToast('Error', error?.message, 'error', 5000)
//     }
//   }

//   const fetchEmailStatistics = useCallback(async () => {
//     try {
//       const result = await getEmailStatistics(statsParams)
//       console.log('result', result)
//       setEmailStats({ data: result, error: null })
//     } catch (e) {
//       // setSearchQuery('')
//       // setStatsParams(DEFAULT_STATS_PARAMS)
//       showCustomToast('Error', 'Error while fetching Email Statistics.', 'error', 5000)
//       setEmailStats({
//         data: null,
//         error: 'Error while fetching Email Statistics.'
//       })
//     }
//   }, [statsParams])

//   const fetchDemoData = useCallback(async () => {
//     try {
//       const result = await getDemoData({ date, date2 })

//       setDemoStats({ data: result, error: null })
//     } catch (e) {
//       showCustomToast('Error', 'Error while fetching Demo Statistics.', 'error', 5000)
//       setDemoStats({
//         data: null,
//         error: 'Error while fetching Demo Statistics.'
//       })
//     }
//   }, [date, date2])

//   useEffect(() => {
//     if (screen && token && [ADMIN_PORTAL_SCREEN.STATISTICS].includes(screen)) {
//     }

//     fetchEmailStatistics()
//     fetchDemoData()
//   }, [token, screen, fetchEmailStatistics, fetchDemoData])

//   const updateStatisticsPagination = async (p: number) => {
//     setStatsParams({
//       ...statsParams,
//       page: p - 1
//     })
//     try {
//       const result = await getEmailStatistics({
//         ...statsParams,
//         page: p - 1
//       })
//       setEmailStats({ data: result, error: null })
//     } catch (e) {
//       // setSearchQuery('')
//       // setStatsParams(DEFAULT_STATS_PARAMS)
//       setEmailStats({
//         data: null,
//         error: 'Error while fetching Email Statistics.'
//       })
//       console.log(`ERROR WHILE FETCHING EMAIL STATS`)
//     }
//   }

//   return (
//     <main className='h-screen bg-[#f4f4f4]'>
//       {screen === ADMIN_PORTAL_SCREEN.LOGIN && (
//         <div className='flex h-full items-center justify-center'>
//           <Card className='w-full max-w-lg space-y-4 border-0 bg-white px-7 py-12 shadow-none'>
//             <CardHeader>
//               <CardTitle>Welcome back</CardTitle>
//               <CardDescription>Login to your account</CardDescription>
//             </CardHeader>
//             <CardContent className='flex flex-col gap-2'>
//               <div className='space-y-4'>
//                 <Form {...form}>
//                   <form
//                     onSubmit={form.handleSubmit(onSubmit)}
//                     className='space-y-4'
//                   >
//                     <FormField
//                       control={form.control}
//                       name='email'
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Email</FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder='example@gmail.com'
//                               type='email'
//                               autoComplete='username'
//                               required
//                               tabIndex={1}
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name='password'
//                       render={({ field }) => (
//                         <FormItem>
//                           <div className='flex items-baseline justify-between py-0.5'>
//                             <FormLabel>Password</FormLabel>
//                             {/* <Link
//                               href={passRedirectParam('/reset-password')}
//                               className='text-sm'
//                               tabIndex={5}
//                             >
//                               Forgot password?
//                             </Link> */}
//                           </div>
//                           <FormControl>
//                             <Input
//                               placeholder='enter your password'
//                               type='password'
//                               autoComplete='current-password'
//                               required
//                               tabIndex={2}
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <Button
//                       type='submit'
//                       className='w-full'
//                       loading={isLoading !== null && isLoading}
//                       tabIndex={3}
//                       loadingText='Logging in'
//                       size='lg'
//                     >
//                       Login
//                     </Button>
//                   </form>
//                 </Form>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//       {screen !== null &&
//         [
//           ADMIN_PORTAL_SCREEN.SEARCH,
//           ADMIN_PORTAL_SCREEN.STATISTICS,
//           ADMIN_PORTAL_SCREEN.DEMO
//         ].includes(screen) && (
//           <Tabs defaultValue='search' className=''>
//             <div className='flex justify-between p-5'>
//               <TabsList className='mb-2 gap-2 bg-card p-0'>
//                 <TabsTrigger
//                   value='search'
//                   onClick={() => setScreen(ADMIN_PORTAL_SCREEN.SEARCH)}
//                   className='rounded-lg border border-primary text-primary data-[state=active]:bg-primary data-[state=active]:text-white '
//                 >
//                   Search
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value='statistics'
//                   onClick={() => setScreen(ADMIN_PORTAL_SCREEN.STATISTICS)}
//                   className='rounded-lg border border-primary text-primary data-[state=active]:bg-primary data-[state=active]:text-white '
//                 >
//                   Statistics
//                 </TabsTrigger>

//                 <TabsTrigger
//                   value='demo'
//                   onClick={() => setScreen(ADMIN_PORTAL_SCREEN.DEMO)}
//                   className='rounded-lg border border-primary text-primary data-[state=active]:bg-primary data-[state=active]:text-white '
//                 >
//                   Book Demo
//                 </TabsTrigger>
//               </TabsList>
//               <div className='flex justify-end'>
//                 <LogoutButton
//                   isAdmin
//                   className='border border-primary bg-transparent text-primary'
//                 />
//               </div>{' '}
//             </div>
//             {screen === ADMIN_PORTAL_SCREEN.SEARCH && (
//               <TabsContent
//                 value='search'
//                 className='mt-0 flex w-full flex-col gap-4'
//               ></TabsContent>
//             )}
//             {screen === ADMIN_PORTAL_SCREEN.STATISTICS && (
//               <TabsContent
//                 value='statistics'
//                 className='mt-0 flex w-full flex-col gap-4'
//               >
//                 <div className='m-8 flex min-h-screen flex-col'>
//                   <div className='m-5 flex space-x-4'>
//                     <div className='flex items-center'>
//                       <p>
//                         <strong>Select time of shooting bulk emails:</strong>
//                       </p>
//                       <span className='border-2 border-solid border-[#0062F1]'>
//                         <DatePicker
//                           dateFormat='dd-MM-YYYY'
//                           selected={date}
//                           onChange={(date: any) => {
//                             setStatsParams({
//                               ...statsParams,
//                               sentAt: format(new Date(date), 'yyyy-MM-dd')
//                             })
//                             setDate(date)
//                           }}
//                         />
//                       </span>
//                     </div>
//                     <div className='flex flex-col items-center gap-4'>
//                       <Label htmlFor='select-expectations' className=''>
//                         <strong>Event Type:</strong>
//                       </Label>
//                       <Select
//                         name='eventType'
//                         value={statsParams?.eventType}
//                         onValueChange={(event) =>
//                           setStatsParams({
//                             ...statsParams,
//                             eventType: event as EmailStatsEventType
//                           })
//                         }
//                       >
//                         <SelectTrigger className='max-w-[120px] bg-secondary'>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value='Open'>Open</SelectItem>
//                           <SelectItem value='Click'>Click</SelectItem>
//                           <SelectItem value='Bounce'>Bounce</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className='flex flex-col items-center gap-4'>
//                       <Label htmlFor='select-expectations' className=''>
//                         <strong>Env:</strong>
//                       </Label>
//                       <Select
//                         name='env'
//                         value={statsParams?.env}
//                         onValueChange={(env) =>
//                           setStatsParams({
//                             ...statsParams,
//                             env: env as EmailStatsEnv
//                           })
//                         }
//                       >
//                         <SelectTrigger className='max-w-[120px] bg-secondary'>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value='DEV'>Dev</SelectItem>
//                           <SelectItem value='PROD'>Prod</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     {/* <button
//                       onClick={fetchEmailStatistics}
//                       className='button-style h-fit cursor-pointer self-center rounded-[81px] border-2 border-solid border-[#0062F1] px-4 py-2 text-sm text-primary'
//                     >
//                       Search
//                     </button> */}
//                   </div>

//                   <div className=''>
//                     <div className='flex flex-col'>
//                       <div className='-m-1.5 overflow-x-auto'>
//                         <div className='inline-block min-w-full p-1.5 align-middle'>
//                           <div className='overflow-hidden'>
//                             <table className='min-w-full divide-y divide-gray-200'>
//                               <thead>
//                                 <tr>
//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     created
//                                   </th>
//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     clicked at
//                                   </th>
//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     opened at
//                                   </th>
//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     sent at
//                                   </th>
//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     template_code
//                                   </th>
//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     email
//                                   </th>
//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     link
//                                   </th>
//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     type
//                                   </th>
//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     env
//                                   </th>
//                                 </tr>
//                               </thead>
//                               <tbody className='divide-y divide-gray-200'>
//                                 {emailStats?.data?.content?.map(
//                                   (
//                                     emailStats: EmailStatisticsResponse,
//                                     index
//                                   ) => (
//                                     <tr key={index}>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {emailStats?.creationTimestamp
//                                           ? format(
//                                               new Date(
//                                                 emailStats?.creationTimestamp
//                                               ),
//                                               'dd-MM-yyyy'
//                                             )
//                                           : 'NA'}
//                                       </td>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {emailStats?.clickedAt
//                                           ? format(
//                                               new Date(emailStats?.clickedAt),
//                                               'dd-MM-yyyy'
//                                             )
//                                           : 'NA'}
//                                       </td>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {emailStats?.openedAt
//                                           ? format(
//                                               new Date(emailStats?.openedAt),
//                                               'dd-MM-yyyy'
//                                             )
//                                           : 'NA'}
//                                       </td>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {emailStats?.sentAt
//                                           ? format(
//                                               new Date(emailStats?.sentAt),
//                                               'dd-MM-yyyy'
//                                             )
//                                           : 'NA'}
//                                       </td>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {emailStats?.templateCode}
//                                       </td>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {emailStats?.email}
//                                       </td>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {emailStats?.clickedLink}
//                                       </td>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {emailStats?.eventType}
//                                       </td>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {emailStats?.env}
//                                       </td>
//                                     </tr>
//                                   )
//                                 )}
//                               </tbody>
//                             </table>
//                           </div>
//                           <Pagination
//                             current={statsParams?.page + 1}
//                             onChange={updateStatisticsPagination}
//                             pageSize={statsParams?.size}
//                             total={emailStats?.data?.totalElements}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {emailStats?.data?.content?.length === 0 && (
//                       <div className='col-span-4 flex h-56  items-center justify-center'>
//                         <h3 className='text-2xl font-bold  text-secondary-foreground '>
//                           No Statistics found
//                         </h3>
//                       </div>
//                     )}

//                     {emailStats === null && (
//                       <div className='col-span-4 flex h-56  items-center justify-center'>
//                         <h3 className='text-2xl font-bold  text-secondary-foreground '>
//                           Loading...
//                         </h3>
//                       </div>
//                     )}

//                     {emailStats?.error !== null && (
//                       <div className='col-span-4 flex h-56  items-center justify-center'>
//                         <h3 className='text-2xl font-bold  text-secondary-foreground '>
//                           {emailStats?.error}
//                         </h3>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </TabsContent>
//             )}

//             {screen === ADMIN_PORTAL_SCREEN.DEMO && (
//               <TabsContent
//                 value='demo'
//                 className='mt-0 flex w-full flex-col gap-4'
//               >
//                 <div className='m-8 flex min-h-screen flex-col'>
//                   <div className='m-5 flex space-x-4'>
//                     <div className='flex items-center gap-1'>
//                       <p>
//                         <strong>Date Range for responses:</strong>
//                       </p>
//                       <span className='border-2 border-solid border-[#0062F1]'>
//                         <DatePicker
//                           dateFormat='dd-MM-YYYY'
//                           selected={date}
//                           onChange={(date: any) => {
//                             setStatsParams({
//                               ...statsParams,
//                               sentAt: format(new Date(date), 'yyyy-MM-dd')
//                             })
//                             setDate(date)
//                           }}
//                         />
//                       </span>
//                       <span className='border-2 border-solid border-[#0062F1]'>
//                         <DatePicker
//                           dateFormat='dd-MM-YYYY'
//                           selected={date2}
//                           onChange={(date: any) => {
//                             setStatsParams({
//                               ...statsParams,
//                               sentAt: format(new Date(date), 'yyyy-MM-dd')
//                             })
//                             setDate2(date)
//                           }}
//                         />
//                       </span>
//                     </div>

//                     {/* <button
//                       onClick={fetchEmailStatistics}
//                       className='button-style h-fit cursor-pointer self-center rounded-[81px] border-2 border-solid border-[#0062F1] px-4 py-2 text-sm text-primary'
//                     >
//                       Search
//                     </button> */}
//                   </div>

//                   <div className=''>
//                     <div className='flex flex-col'>
//                       <div className='-m-1.5 overflow-x-auto'>
//                         <div className='inline-block min-w-full p-1.5 align-middle'>
//                           <div className='overflow-hidden'>
//                             <table className='min-w-full divide-y divide-gray-200'>
//                               <thead>
//                                 <tr>
//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     clicked at
//                                   </th>

//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     First Name
//                                   </th>
//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     Last Name
//                                   </th>
//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     Email
//                                   </th>
//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     Startup Name
//                                   </th>
//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     Purpose
//                                   </th>
//                                   <th
//                                     scope='col'
//                                     className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
//                                   >
//                                     Phone No.
//                                   </th>
//                                 </tr>
//                               </thead>
//                               <tbody className='divide-y divide-gray-200'>
//                                 {demoStats?.data?.map(
//                                   (demo: any, index: number) => (
//                                     <tr key={index}>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {format(
//                                           new Date(demo?.creationTimestamp),
//                                           'dd-MM-yyyy'
//                                         )}
//                                       </td>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {demo?.firstName}
//                                       </td>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {demo?.lastName}
//                                       </td>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {demo?.businessEmail}
//                                       </td>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {demo.startupName}
//                                       </td>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {demo.purpose}
//                                       </td>
//                                       <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
//                                         {demo.phoneNumber}
//                                       </td>
//                                     </tr>
//                                   )
//                                 )}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {demoStats?.data?.length === 0 && (
//                       <div className='col-span-4 flex h-56  items-center justify-center'>
//                         <h3 className='text-2xl font-bold  text-secondary-foreground '>
//                           No Booking Found
//                         </h3>
//                       </div>
//                     )}

//                     {demoStats === null && (
//                       <div className='col-span-4 flex h-56  items-center justify-center'>
//                         <h3 className='text-2xl font-bold  text-secondary-foreground '>
//                           Loading...
//                         </h3>
//                       </div>
//                     )}

//                     {demoStats?.error !== null && (
//                       <div className='col-span-4 flex h-56  items-center justify-center'>
//                         <h3 className='text-2xl font-bold  text-secondary-foreground '>
//                           {demoStats?.error}
//                         </h3>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </TabsContent>
//             )}
//           </Tabs>
//         )}
//     </main>
//   )
// }

// export default AdminPortal

import React from 'react'

import { showCustomToast } from '@/components/custom-toast'

const Old = () => {
  return <div>Old</div>
}

export default Old
