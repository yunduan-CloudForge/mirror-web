import { Link as RouterLink } from 'react-router-dom'
import { format } from 'timeago.js'
import { useQuery } from '@tanstack/react-query'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid2'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Link from '@mui/material/Link'
import IconButton from '@mui/material/IconButton'
import Check from 'mdi-material-ui/Check'
import Sync from 'mdi-material-ui/Sync'
import Close from 'mdi-material-ui/Close'
import HelpCircle from 'mdi-material-ui/HelpCircle'
import Loading from '@/components/Loading'
import LoadFailed from '@/components/LoadFailed'
import VirtualizedTable from '@/components/VirtualizedTable'
import Title from '@/components/HomeTitle'
import Tools from '@/components/HomeTools'
import Links from '@/components/HomeLinks'
import helpConfig from '@/assets/metadata/help.json'

interface MirrorWorkerStatus {
  Result: boolean,
  LastFinished: string,
  Idle: boolean
}

interface MirrorSummary {
  Running: boolean,
  WorkerStatus: Record<string, MirrorWorkerStatus>
}

type HomeMirrorItem = {
  name: JSX.Element,
  update: string,
  status: JSX.Element
}

const MirrorNameWithHelp = ({ name }: { name: string }) => (
  <>
    <Link
      component={RouterLink}
      sx={{ fontWeight: 'medium' }}
      underline="none"
      to={`${name}/`}
    >
      {name}
    </Link>
    {Object.hasOwn(helpConfig, name) &&
      <IconButton
        component={RouterLink}
        color="primary"
        size="small"
        to={`/help/${name}`}
        title={`Help for ${name}`}
        sx={{ padding: 0, marginLeft: '4px' }}
      >
        <HelpCircle sx={{ fontSize: 16 }} />
      </IconButton>
    }
  </>
)

const StatusChip = ({ idle, success }: { idle: boolean, success: boolean }) => {
  enum Status { Idle, Success, Fail }
  interface SyncStatusMeta {
    icon: JSX.Element,
    label: string,
    color: 'info' | 'success' | 'warning'
  }
  const syncStatusMeta = {
    [Status.Idle]: { icon: <Sync />, label: '正在同步', color: 'info' },
    [Status.Success]: { icon: <Check />, label: '同步成功', color: 'success' },
    [Status.Fail]: { icon: <Close />, label: '同步失败', color: 'warning' }
  } as Record<Status, SyncStatusMeta>
  const status = idle ? (success ? Status.Success : Status.Fail) : Status.Idle
  const { icon, label, color } = syncStatusMeta[status]
  return <Chip icon={icon} label={label} size="small" color={color} />
}

export default () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['summaryData'],
    queryFn: async () => {
      const {
        MIRROR_BACKEND_SEPARATION,
        MIRROR_API_PROTOCOL,
        MIRROR_DOMAIN,
        MIRROR_SUMMARY
      } = import.meta.env

      const prefixAddress = MIRROR_BACKEND_SEPARATION === 'true' ?
        `${MIRROR_API_PROTOCOL}://${MIRROR_DOMAIN}` : ''

      const response = await fetch(`${prefixAddress}${MIRROR_SUMMARY}`)
      const summary = await response.json() as MirrorSummary

      return Object.entries(summary.WorkerStatus).map(([key, value]) => ({
        name: <MirrorNameWithHelp name={key} />,
        update: format(value.LastFinished, 'zh_CN'),
        status: <StatusChip idle={value.Idle} success={value.Result} />
      }))
    }
  }) as { isLoading: boolean, isError: boolean, data: HomeMirrorItem[] }

  return (
    <Container maxWidth="lg">
      <Title />
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          {isLoading ? <Loading /> :
            (isError ? <LoadFailed /> :
              <Paper elevation={3}>
                <VirtualizedTable data={data} columns={[
                  { label: '名称', dataKey: 'name', align: 'left' },
                  { label: '上次同步', dataKey: 'update', align: 'center' },
                  { label: '状态', dataKey: 'status', align: 'right' }
                ]} />
              </Paper>
            )
          }
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={4}>
            <Tools />
            <Links />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  )
}
