// 'use client'
// import React from 'react'
// import Image from 'next/image'
// import { useState, useEffect } from 'react';
// import Modal from '@/app/components/ui/Modal';
// import { useRouter } from 'next/navigation';
// import '../../OLD.css'



// export default function ScoreCard() {
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);
//   const STORAGE_KEY = 1679
//   const [passCode, setPassCode] = useState(1406);
//   const [userCode, setUserCode] = useState('')

//     useEffect(() => {
//     const checkCode = localStorage.getItem(STORAGE_KEY);

//     if (checkCode !== 'true') {
//       setIsOpen(true);
//     }
//   }, []);
  
//   const handleClose = () => {
//     setIsOpen(false);
//     router.push('/');  
//   };

//   const handleChange = (e) => {
//     e.preventDefault();
//     setUserCode(e.target.value)
//     }

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (Number(userCode) === passCode) {
//       localStorage.setItem(STORAGE_KEY, "true");
//       setIsOpen(false);
//     } else {
//       alert("Code is incorrect")
//       setUserCode('')
//     }
//   }


//   return (
//     <div className="scorecard-container">
//       <Modal
//         isOpen={isOpen}
//         onClose={handleClose}
//         title="ScoreCard Restricted"
//         message="Access is Exclusive to Orienteers"
//         link="Click Here to Own Your Time"
//         handleChange={handleChange}
//         userCode={userCode}
//         handleSubmit={handleSubmit}
//       />
//       <div className='scbg'>
//       <Image
//         src="/scf9.png"
//         alt="Front 9"
//         width={324}
//         height={810}
//         />
//       </div>
//       <div className='scbg'>
//       <Image
//         src="/scb9.png"
//         alt="Back 9"
//         width={324}
//         height={810}
//         />
//       </div>
//     </div>
//   )
// }
