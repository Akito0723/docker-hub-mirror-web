<template>
  <el-row>
    <el-container>
      <el-row>
        <svg-icon icon-class="github" style="float:left;color: inherit;" @click="goToProject"/>
      </el-row>
      <el-header>
        <el-row type="flex" justify="center">
          <h2 >自用 Docker Hub 镜像加速</h2>
        </el-row>
      </el-header>
      <el-divider content-position="center">
        <el-button
            type="theme"
            @click="changeTheme">
          <i id="sunny" class="el-icon-sunny"></i>
          <i id="moon" class="el-icon-moon"></i>
        </el-button>
      </el-divider>
      <el-header>
        <el-row style="height: 100%"
                v-loading="this.health_delay === '检测中...'"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
          <el-col :span="8">
            <h3>代理服务器连通状态：</h3>
            <svg-icon :style="health_svg_color" :icon-class="health_status"/>
          </el-col>
          <el-col :span="8">
            <h3>延迟：&nbsp;&nbsp;{{this.health_delay}}ms</h3>
          </el-col>
        </el-row>
      </el-header>
      <el-header>
        <el-row v-loading="this.VPSInfo === '检测中...'"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
          <el-col :span="24">
            <h3>代理服务器流量：{{this.VPSInfo}}</h3>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-row>
          <h3>为了加速镜像拉取，使用以下命令设置<b>registry mirror</b></h3>
          <el-row class="pre-wrapper">
            <highlightjs autodetect :code="code1" />
            <el-button
                class="copy-btn"
                v-clipboard:copy="code1"
                v-clipboard:success="onCopy"
                icon="el-icon-document-copy"
            >复制</el-button>
          </el-row>
          <el-row class="pre-wrapper">
            <highlightjs autodetect :code="code2"/>
            <el-button
                class="copy-btn"
                v-clipboard:copy="code2"
                v-clipboard:success="onCopy"
                icon="el-icon-document-copy"
            >复制</el-button>
          </el-row>
          <el-row class="pre-wrapper">
            <highlightjs autodetect :code="code3"/>
            <el-button
                class="copy-btn"
                v-clipboard:copy="code3"
                v-clipboard:success="onCopy"
                icon="el-icon-document-copy"
            >复制</el-button>
          </el-row>
          <el-row class="pre-wrapper">
            <highlightjs autodetect :code="code4"/>
            <el-button
                class="copy-btn"
                v-clipboard:copy="code4"
                v-clipboard:success="onCopy"
                icon="el-icon-document-copy"
            >复制</el-button>
          </el-row>
          <el-row class="pre-wrapper">
            <highlightjs autodetect :code="code5"/>
            <el-button
                class="copy-btn"
                v-clipboard:copy="code5"
                v-clipboard:success="onCopy"
                icon="el-icon-document-copy"
            >复制</el-button>
          </el-row>
          <h3>不用设置环境也可以直接使用，用法示例（根据实际需要替换对应的镜像）：</h3>
          <el-row class="pre-wrapper">
            <highlightjs autodetect :code="code6"/>
            <el-button
                class="copy-btn"
                v-clipboard:copy="code6"
                v-clipboard:success="onCopy"
                icon="el-icon-document-copy"
            >复制</el-button>
          </el-row>
          <p>说明：library是一个特殊的命名空间，它代表的是官方镜像。</p>
        </el-row>
      </el-main>
      <el-footer>
        <el-row justify="center">
          &copy; 自建站点，请勿滥用。
        </el-row>
        <el-row justify="center">
          <div class="busuanzi">
            <span id="busuanzi_container_site_pv">总访问量<span id="busuanzi_value_site_pv"></span>次</span>&nbsp;
            <span id="busuanzi_container_site_uv">总访客数<span id="busuanzi_value_site_uv"></span>人</span>
          </div>
        </el-row>
      </el-footer>
    </el-container>
  </el-row>
</template>
<script>
let script;
const project = process.env.VUE_APP_PROJECT
const url = process.env.VUE_APP_DOMAIN
const domain = url.replace(/^http:\/\/|https:\/\//, '');

export default {
  data() {
    return {
      health_delay: '检测中...',
      health_status: 'check-fail',
      VPSInfo: '检测中...',
      health_svg_color: 'color: #f56c6c; height: 100%;',
      // 是否为 PC 端
      isPC: true,
      code1: 'sudo mkdir -p /etc/docker',
      code2: `sudo tee /etc/docker/daemon.json <<EOF
{
    "registry-mirrors": ["${url}"]
}
EOF`,
      code3: 'sudo systemctl daemon-reload',
      code4: 'sudo systemctl restart docker',
      code5: 'sudo systemctl restart docker',
      code6: `# 拉取镜像
docker pull ${domain}/library/mysql:5.7
# 重命名镜像
docker image tag ${domain}/library/mysql:5.7 library/mysql:5.7
# 删除镜像
docker rmi ${domain}/library/mysql:5.7`,
    };
  },
  created() {
    this.isPC = this.$getOS().isPc;
  },
  // busuanzi监听
  watch: {
    $route(to, from) {
      if (to.path !== from.path) {
        script.fetch();
      }
    }
  },
  mounted() {
    // busuanzi
    script = require("busuanzi.pure.js");
    // 获取后台代理状态
    this.getHealth();
    // 获取VPS信息
    this.getVPSInfo();
    // 处理主题
    this.processTheme();
  },
  methods: {
    processTheme() {
      const getLocalTheme = window.localStorage.getItem("localTheme");
      // 窗口主题
      const lightMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)');
      const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
      // 读取localstorage，优先级最高
      if (getLocalTheme) {
        document.getElementsByTagName('body')[0].className = getLocalTheme;
      } else if (getLocalTheme == null || getLocalTheme === "undefined" || getLocalTheme === "") {
        if (new Date().getHours() >= 19 || new Date().getHours() < 7) {
          // 根据当前时间来判断，用来对付QQ等不支持媒体变量查询的浏览器
          document.getElementsByTagName('body')[0].setAttribute('class', 'light-mode');
        } else {
          document.getElementsByTagName('body')[0].setAttribute('class', 'dark-mode');
        }
        // 根据窗口主题来判断当前主题
        if (lightMode && lightMode.matches) {
          document.getElementsByTagName('body')[0].setAttribute('class', 'light-mode');
        }
        if (darkMode && darkMode.matches) {
          document.getElementsByTagName('body')[0].setAttribute('class', 'dark-mode');
        }
      }
    },
    changeTheme() {
      var nowTheme = document.getElementsByTagName('body')[0].className;
      if (nowTheme === 'light-mode') {
        document.getElementsByTagName('body')[0].setAttribute('class', 'dark-mode');
        window.localStorage.setItem('localTheme', 'dark-mode');
      }
      if (nowTheme === 'dark-mode') {
        document.getElementsByTagName('body')[0].setAttribute('class', 'light-mode');
        window.localStorage.setItem('localTheme', 'light-mode');
      }
    },
    onCopy() {
      this.$message.success("已复制");
    },
    goToProject() {
      window.open(project);
    },
    getVPSInfo() {
      this.$axios.post("/api/client/info")
          .then(res => {
            if (res.data) {
              const xml = `<root>${res.data}</root>`;
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(xml, 'text/xml');
              const bw = xmlDoc.getElementsByTagName('bw')[0].textContent;
              // 已使用百分比(0-100)
              const usedPresent = bw.split(",")[3]
              // 已用
              const used = bw.split(",")[1];
              // 总量
              const total = bw.split(",")[0];
              const usedTraffic = this.formatBytes(used);
              const leftTraffic = this.formatBytes(total - used);
              this.VPSInfo = `已使用：${usedTraffic}，剩余流量：${leftTraffic}`
            }

          })
          .catch(function (error) {
            this.VPSInfo = '获取VPS信息失败';
          });
    },
    getHealth() {
      let that = this;
      this.$axios.get("/v2/")
          .catch(function (error) {
            let api_version = error.response.headers['docker-distribution-api-version']
            let code = error.response.status
            if (api_version === 'registry/2.0' && code === 401) {
              that.health_status = 'check-success'
              that.health_delay = error.duration + '';
              that.health_svg_color = 'color: #67c23a; height: 100%;'
            } else {
              that.health_status = 'check-fail'
              that.health_svg_color = 'color: #f56c6c; height: 100%;'
              that.health_delay = error.duration  + '';
            }
      });
    },
    formatBytes(bytes) {
      const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      let i = 0;

      while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
      }
      return `${bytes.toFixed(2)} ${units[i]}`;
    }

  }
};
</script>

<style lang="scss" scoped>
h2 {
  text-align: center;
}
p {
  margin-bottom: 1em;
}
.el-col {
  height: 100%;
  display: flex;
  align-items: center;
}
.pre-wrapper:hover .copy-btn {
  display: block;
}
.copy-btn {
  position: absolute;
  right: 1em;
  top: 2em;
  display: none;
  border-radius: 5px;
}
</style>