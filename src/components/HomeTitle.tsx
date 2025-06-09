import Typography from '@mui/material/Typography'

export default () => (
  <>
    <Typography
      component="h1"
      variant="h4"
      sx={{ fontWeight: 'bold', marginTop: { lg: 4 } }}
      gutterBottom
    >
      稳定性无限趋近0%的镜像服务
    </Typography>
    <Typography
      component="h2"
      variant="h6"
      sx={{ marginBottom: { xs: 3, lg: 5 } }}
    >
      运行于 轻巧实验室 云业务节点
    </Typography>
  </>
)
