import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewPage from './pages/InterviewPage'
import InterviewHistory from './pages/InterviewHistory'
import Pricing from './pages/Pricing'
import InterviewReport from './pages/InterviewReport'
import Guidance from './pages/Guidance'
import ResumeTips from './pages/ResumeTips'
import CompanyPrep from './pages/CompanyPrep'
import Roadmap from './pages/Roadmap'
import PlacementTestPage from './pages/PlacementTestPage'
import PlacementResultsPage from './pages/PlacementResultsPage'
import { ServerUrl } from './utils/serverUrl'

function App() {


  const dispatch = useDispatch()
  useEffect(()=>{
    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/user/current-user", {withCredentials:true})
        dispatch(setUserData(result.data))
      } catch (error) {
        console.log(error)
        dispatch(setUserData(null))
      }
    }
    getUser()

  },[dispatch])
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/auth' element={<Auth/>}/>
      <Route path='/interview' element={<InterviewPage/>}/>
      <Route path='/interview-session' element={<InterviewPage stepProp={2}/>}/>
      <Route path='/history' element={<InterviewHistory/>}/>
      <Route path='/pricing' element={<Pricing/>}/>
      <Route path='/report/:id' element={<InterviewReport/>}/>
      <Route path='/guidance' element={<Guidance/>}/>
      <Route path='/resume-tips' element={<ResumeTips/>}/>
      <Route path='/company-prep' element={<CompanyPrep/>}/>
      <Route path='/roadmap' element={<Roadmap/>}/>
      <Route path='/placement-test' element={<PlacementTestPage/>}/>
      <Route path='/placement%20test' element={<PlacementTestPage/>}/>
      <Route path='/placement test' element={<PlacementTestPage/>}/>
      <Route path='/placement-results/:id' element={<PlacementResultsPage/>}/>
    </Routes>
  )
}

export default App
