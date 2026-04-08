import StaticPage from './StaticPage'
import { sstData } from '../data/staticSections'

export default function SST() {
  return <StaticPage data={sstData} accentColor="#dc2626" />
}
