import * as Ic from './icons.jsx'

export const CATEGORIES = [
  { id: 'pothole', label: 'Pothole', key: 'catPothole', icon: Ic.Pothole, dept: 'Roads' },
  { id: 'garbage', label: 'Garbage', key: 'catGarbage', icon: Ic.Garbage, dept: 'Solid Waste Management' },
  { id: 'streetlight', label: 'Streetlight', key: 'catStreetlight', icon: Ic.Streetlight, dept: 'Electrical' },
  { id: 'footpath', label: 'Footpath', key: 'catFootpath', icon: Ic.Footpath, dept: 'Roads' },
  { id: 'water', label: 'Water', key: 'catWater', icon: Ic.Water, dept: 'Hydraulic Engineering' },
  { id: 'other', label: 'Other', key: 'catOther', icon: Ic.Other, dept: 'General' },
]

export const catById = (id) => CATEGORIES.find((c) => c.id === id)

export const STATUS = {
  submitted: { label: 'Submitted', cls: 'submitted' },
  progress: { label: 'In progress', cls: 'progress' },
  fixed: { label: 'Fixed', cls: 'fixed' },
}

// Mock location returned by "detect my location"
export const MOCK_LOCATION = {
  lat: 18.9282,
  lng: 72.8321,
  label: 'Kala Ghoda, Fort',
  address: 'Rampart Row, Kala Ghoda, Fort, Mumbai 400001',
  ward: 'A Ward',
}

// Complaints the demo user has already made
export const MY_REPORTS = [
  {
    id: 'A-2026-4821',
    category: 'footpath',
    title: 'Broken footpath tiles',
    description: 'Tiles are loose and uneven near the bus stop. People trip here every day.',
    location: 'Rampart Row, Kala Ghoda',
    ward: 'A Ward',
    status: 'progress',
    photo: '/mine/footpath.jpg',
    reported: '12 Sep 2026, 8:40 am',
    updated: '15 Sep 2026',
    timeline: [
      { t: '12 Sep, 8:40 am', title: 'Complaint received', note: 'Sent to A Ward · Roads' },
      { t: '13 Sep, 11:15 am', title: 'Assigned to supervisor', note: 'Site inspection scheduled' },
      { t: '15 Sep, 4:30 pm', title: 'Work in progress', note: 'Repair expected within 7 days' },
      { t: null, title: 'Fixed', note: 'You will be notified' },
    ],
  },
  {
    id: 'A-2026-4803',
    category: 'streetlight',
    title: 'Streetlight not working',
    description: 'Lamp post outside the museum gate has been off for a week.',
    location: 'MG Road, Fort',
    ward: 'A Ward',
    status: 'progress',
    photo: '/mine/streetlight.jpg',
    reported: '8 Sep 2026, 7:05 pm',
    updated: '10 Sep 2026',
    timeline: [
      { t: '8 Sep, 7:05 pm', title: 'Complaint received', note: 'Sent to A Ward · Electrical' },
      { t: '10 Sep, 10:00 am', title: 'Assigned to supervisor', note: 'Cable fault suspected' },
      { t: null, title: 'Work in progress', note: '' },
      { t: null, title: 'Fixed', note: '' },
    ],
  },
  {
    id: 'A-2026-4776',
    category: 'garbage',
    title: 'Garbage not collected',
    description: 'Bin near the corner has been overflowing for 3 days.',
    location: 'Colaba Causeway',
    ward: 'A Ward',
    status: 'fixed',
    photo: '/mine/garbage.jpg',
    reported: '2 Sep 2026, 9:20 am',
    updated: '4 Sep 2026',
    timeline: [
      { t: '2 Sep, 9:20 am', title: 'Complaint received', note: 'Sent to A Ward · SWM' },
      { t: '2 Sep, 2:00 pm', title: 'Assigned to team', note: '' },
      { t: '3 Sep, 7:30 am', title: 'Work in progress', note: 'Collection vehicle dispatched' },
      { t: '4 Sep, 8:10 am', title: 'Fixed', note: 'Bin cleared and area cleaned' },
    ],
  },
]

// Issues near the user (Around Me)
export const AROUND = [
  { id: 'n1', category: 'streetlight', title: 'Streetlight not working', location: 'Kala Ghoda', status: 'progress', dist: '120 m', before: '14 Sep', after: null, reports: 4, photo: '/around/streetlight-before.jpg' },
  { id: 'n2', category: 'footpath', title: 'Broken footpath', location: 'MG Road', status: 'fixed', dist: '300 m', before: '12 Sep', after: '16 Sep', reports: 7, photo: '/around/footpath-before.jpg', afterPhoto: '/around/footpath-after.jpg' },
  { id: 'n3', category: 'garbage', title: 'Overflowing bin', location: 'Kala Ghoda', status: 'fixed', dist: '350 m', before: '10 Sep', after: '11 Sep', reports: 3, photo: '/around/garbage-before.jpg', afterPhoto: '/around/garbage-after.jpg' },
  { id: 'n4', category: 'pothole', title: 'Pothole near signal', location: 'Fort', status: 'progress', dist: '450 m', before: '15 Sep', after: null, reports: 11, photo: '/around/pothole-before.jpg' },
  { id: 'n5', category: 'water', title: 'Water leaking from pipe', location: 'Colaba Causeway', status: 'submitted', dist: '600 m', before: '18 Sep', after: null, reports: 2, photo: '/around/pipe-before.jpg' },
  { id: 'n6', category: 'pothole', title: 'Road surface damaged', location: 'Fort', status: 'fixed', dist: '700 m', before: '1 Sep', after: '9 Sep', reports: 15, photo: '/around/road-before.jpg', afterPhoto: '/around/road-after.jpg' },
]

export const AROUND_STATS = { fixed: 8, open: 5 }

export const OTHER_WAYS = [
  { icon: Ic.Phone, titleKey: 'call1916', subKey: 'tollFree', href: 'tel:1916' },
  { icon: Ic.Chat, title: 'WhatsApp', sub: '+91 89999 28999', href: 'https://wa.me/918999928999' },
  { icon: Ic.Globe, titleKey: 'website', sub: 'portal.mcgm.gov.in', href: 'https://portal.mcgm.gov.in' },
]

export function newComplaintId() {
  const n = 4800 + Math.floor(Math.random() * 199)
  return `A-2026-${n}`
}

export function nowStamp() {
  const d = new Date()
  const date = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const time = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
  return `${date}, ${time}`
}
