<template>
  <view class="container">
    <u-skeleton rows="25" :loading="isLoading"></u-skeleton>

    <u-modal :show="shouldShowStatement" @confirm="confirmStatement">
      <rich-text :nodes="statement"></rich-text>
    </u-modal>

    <view v-if="!isLoading" class="questionnaire">
      <view class="questionnaire-cell">
        <u--text
            type="primary"
            :bold="true"
            size="16"
            text="1. 基本信息"
        ></u--text>

        <u--form
            :model="submission"
            :rules="basicInfoFormRules"
            ref="basicInfoForm"
        >
          <u-form-item label="学号" :required="true" prop="studentId">
            <u--input
                prefixIcon="account"
                placeholder="请输入学号"
                v-model="submission.studentId"
            >
            </u--input>
          </u-form-item>
        </u--form>
      </view>

      <u-gap></u-gap>

      <view class="questionnaire-cell">
        <u--text
            type="primary"
            :bold="true"
            size="16"
            text="2. 上一轮填写全体同学的观点分布"
        ></u--text>

        <view v-if="isAttitudeOverallDistLoaded" class="opinion-dist-cell">
          <u--text
              type="default"
              :bold="true"
              size="14"
              :text="'2.1 针对“' + previousQuestionContent.attitudeQuestion.numberBoundaryQuestion.content + '”这一问题，上一轮填写中全体同学观点的分布为'"
          ></u--text>

          <view class="charts-box">
            <qiun-data-charts
                type="customrose"
                :chartData="attitudeOverallDist"
                :loadingType="5"
                background="none"
            />
          </view>
        </view>

        <view v-if="isPriceOptionOverallDistLoaded" class="opinion-dist-cell">
          <u--text
              type="default"
              :bold="true"
              size="14"
              :text="'2.2 针对“' + previousQuestionContent.priceQuestion.optionQuestion.content + '”这一问题，上一轮填写中全体同学观点的分布为'"
          ></u--text>

          <view class="charts-box">
            <qiun-data-charts
                type="customrose"
                :chartData="priceOptionOverallDist"
                :loadingType="5"
                background="none"
            />
          </view>
        </view>

        <view v-if="isLengthOptionOverallDistLoaded" class="opinion-dist-cell">
          <u--text
              type="default"
              :bold="true"
              size="14"
              :text="'2.3 针对“' + previousQuestionContent.lengthQuestion.optionQuestion.content + '”这一问题，上一轮填写中全体同学观点的分布为'"
          ></u--text>

          <view class="chart-box">
            <qiun-data-charts
                type="customrose"
                :chartData="lengthOptionOverallDist"
                :loadingType="5"
                background="none"
            />
          </view>
        </view>

        <view class="opinion-dist-cell">
          <u-button
              type="primary"
              text="获取观点分布"
              @click="fetchAllOverallDist"
          ></u-button>
        </view>
      </view>

      <u-gap></u-gap>

      <view class="questionnaire-cell">
        <u--text
            type="primary"
            :bold="true"
            size="16"
            :text="'3. ' + attitudeQuestion.numberBoundaryQuestion.content"
        ></u--text>

        <u-row justify="space-between" gutter="10">
          <u-col span="11">
            <el-slider
                :step="1"
                :min="attitudeQuestion.numberBoundaryQuestion.min"
                :max="attitudeQuestion.numberBoundaryQuestion.max"
                :marks="attitudeQuestion.numberBoundaryQuestion.marks"
                :show-tooltip="false"
                show-stops
                v-model="submission.opinionItem.attitude"
            ></el-slider>
          </u-col>

          <u-col span="1">
            <u--text
                type="primary"
                :bold="true"
                size="16"
                :text="submission.opinionItem.attitude"
            >
            </u--text>
          </u-col>
        </u-row>
      </view>

      <u-gap></u-gap>

      <view v-if="shouldShowPriceQuestion" class="questionnaire-cell">
        <u--text
            type="primary"
            :bold="true"
            size="16"
            :text="'4. ' + priceQuestion.optionQuestion.content"
        ></u--text>

        <u-radio-group
            placement="column"
            activeColor="#3c9cff"
            @change="selectPriceOpinion"
        >
          <u-radio
              v-for="option in priceQuestion.optionQuestion.option"
              :key="option.optionKey"
              :label="option.optionKey + '. ' + option.optionValue"
              :name="option.optionKey"
          ></u-radio>
        </u-radio-group>
      </view>

      <u-gap></u-gap>

      <view v-if="shouldShowLengthQuestion" class="questionnaire-cell">
        <u--text
            type="primary"
            :bold="true"
            size="16"
            :text="'5. ' + lengthQuestion.optionQuestion.content"
        ></u--text>

        <u-radio-group
            placement="column"
            activeColor="#3c9cff"
            @change="selectLengthOpinion"
        >
          <u-radio
              v-for="option in lengthQuestion.optionQuestion.option"
              :key="option.optionKey"
              :label="option.optionKey + '. ' + option.optionValue"
              :name="option.optionKey"
          ></u-radio>
        </u-radio-group>
      </view>

      <u-gap></u-gap>

      <view class="questionnaire-cell">
        <u-button type="primary" text="提交" @click="submit()"></u-button>
      </view>
    </view>

    <u-toast ref="toast"></u-toast>
  </view>
</template>

<script>
import {getQuestionByQuestionId} from '@/api/question'
import {
  getAttitudeOverallDistribution,
  getPriceOptionOverallDistribution,
  getLengthOptionOverallDistribution
} from '@/api/opinion'
import {submitAdvanced} from '@/api/questionnaire'
import StatusCode from '@/common/statusCode'

export default {
  data() {
    return {
      isLoading: true,
      shouldShowStatement: false,
      statement: `
				<p style="line-height: 2em;">
				    亲爱的同学：<br/>
				</p>
				<p style="text-indent: 2em; line-height: 2em;">
				    您好！本次调查旨在更好地了解学生成长，以便更好地为您提供服务。学院组织本次调研活动，填写时请根据您的实际情况选择，谢谢您的支持与配合！对您填答的信息，本调研将严格遵循《中华人民共和国统计法》予以保密。感谢您参与本次调查！<br/>
				</p>
				<p style="text-indent: 2em; text-align: right; line-height: 2em;">
				    詹天佑学院学生工作办公室<br/>
				</p>
				<p style="text-indent: 2em; text-align: right; line-height: 2em;">
				    2022年3月9日
				</p>
				`,
      questionId: 2,
      previousQuestionId: 1,
      previousQuestionContent: null,
      isAttitudeOverallDistLoaded: false,
      attitudeOverallDist: {
        categories: [],
        series: [
          {
            data: [],
          },
        ],
      },
      isPriceOptionOverallDistLoaded: false,
      priceOptionOverallDist: {
        categories: [],
        series: [
          {
            data: [],
          },
        ],
      },
      isLengthOptionOverallDistLoaded: false,
      lengthOptionOverallDist: {
        categories: [],
        series: [
          {
            data: [],
          },
        ],
      },
      attitudeQuestion: {
        numberBoundaryQuestion: {
          content: null,
          min: null,
          max: null,
          marks: null,
        },
      },
      priceQuestion: {
        attitudeThreshold: null,
        optionQuestion: {
          content: null,
          option: null,
        },
      },
      lengthQuestion: {
        attitudeThreshold: null,
        optionQuestion: {
          content: null,
          option: null,
        },
      },
      submission: {
        studentId: null,
        opinionItem: {
          questionId: null,
          attitude: 5,
          priceOptionKey: null,
          lengthOptionKey: null,
          opinion: null,
        },
      },
      basicInfoFormRules: {
        studentId: [
          {
            required: true,
            message: '请填写学号',
            trigger: ['blur', 'change'],
          },
          {
            pattern: /^\d{8}$/g,
            transform(value) {
              return String(value)
            },
            message: '学号只能包含8位数字',
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },
  computed: {
    shouldShowPriceQuestion() {
      return parseInt(this.submission.opinionItem.attitude) > parseInt(this.priceQuestion.attitudeThreshold)
    },
    shouldShowLengthQuestion() {
      return parseInt(this.submission.opinionItem.attitude) > parseInt(this.lengthQuestion.attitudeThreshold)
    },
  },
  watch: {
    shouldShowPriceQuestion: function (val, oldVal) {
      if (val === false) {
        this.submission.opinionItem.priceOptionKey = null
      }
    },
    shouldShowLengthQuestion: function (val, oldVal) {
      if (val === false) {
        this.submission.opinionItem.lengthOptionKey = null
      }
    },
  },
  onShow() {
    this.submission.opinionItem.questionId = this.questionId

    this.isAttitudeOverallDistLoaded = false
    this.attitudeOverallDist = {
      categories: [],
      series: [
        {
          data: [],
        },
      ],
    }

    this.isPriceOptionOverallDistLoaded = false
    this.priceOptionOverallDist = {
      categories: [],
      series: [
        {
          data: [],
        },
      ],
    }

    this.isLengthOptionOverallDistLoaded = false
    this.lengthOptionOverallDist = {
      categories: [],
      series: [
        {
          data: [],
        },
      ],
    }

    getQuestionByQuestionId(this.questionId).then(res => {
      if (res.data.status === StatusCode.SUCCESS) {
        this.previousQuestionId = res.data.data.previousQuestionId

        const questionContent = res.data.data.questionContent
        this.attitudeQuestion = questionContent.attitudeQuestion
        this.attitudeQuestion.numberBoundaryQuestion.marks = JSON.parse(this.attitudeQuestion.numberBoundaryQuestion.marks)
        this.priceQuestion = questionContent.priceQuestion
        this.lengthQuestion = questionContent.lengthQuestion

        this.isLoading = false
        this.shouldShowStatement = true
      } else {
        this.showToast({
          message: `加载问题信息失败，${res.data.message}`,
          type: 'error',
        })
      }
    }).catch(error => {
      this.showToast({
        message: `加载问题信息失败，${error}`,
        type: 'error',
      })
    })
  },
  methods: {
    confirmStatement() {
      this.shouldShowStatement = false
    },
    selectPriceOpinion(name) {
      this.submission.opinionItem.priceOptionKey = name
    },
    selectLengthOpinion(name) {
      this.submission.opinionItem.lengthOptionKey = name
    },
    checkOptionKeyExists(optionList, optionKey) {
      for (let i = 0; i < optionList.length; i++) {
        if (optionList[i].optionKey === optionKey) {
          return true
        }
      }

      return false
    },
    parseAttitudeOverallDist(rawDist) {
      const data = []

      for (let i = 0; i < rawDist.length; i++) {
        data.push({
          name: rawDist[i].name,
          value: rawDist[i].count,
        })
      }

      return data
    },
    parsePriceOptionOverallDist(rawDist) {
      const data = []

      for (let i = 0; i < rawDist.length; i++) {
        data.push({
          name: rawDist[i].name,
          value: rawDist[i].count,
        })
      }

      return data
    },
    parseLengthOptionOverallDist(rawDist) {
      const data = []

      for (let i = 0; i < rawDist.length; i++) {
        data.push({
          name: rawDist[i].name,
          value: rawDist[i].count,
        })
      }

      return data
    },
    fetchAllOverallDist() {
      getQuestionByQuestionId(this.previousQuestionId).then(res => {
        if (res.data.status === StatusCode.SUCCESS) {
          this.previousQuestionContent = res.data.data.questionContent
          this.previousQuestionContent.attitudeQuestion.numberBoundaryQuestion.marks = JSON.parse(this.previousQuestionContent.attitudeQuestion.numberBoundaryQuestion.marks)
        } else {
          this.showToast({
            message: `加载上一轮问题信息失败，${res.data.message}`,
            type: 'error',
          })
        }
      }).catch(error => {
        this.showToast({
          message: `加载上一轮问题信息失败，${error}`,
          type: 'error',
        })
      })

      this.isAttitudeOverallDistLoaded = true
      this.attitudeOverallDist.series = []
      getAttitudeOverallDistribution(this.previousQuestionId).then(res => {
        if (res.data.status === StatusCode.SUCCESS) {
          const rawOverallDist = res.data.data.attitudeOverallDist
          const parsedOverallDist = this.parseAttitudeOverallDist(rawOverallDist)
          this.attitudeOverallDist.series.push({})

          if (parsedOverallDist.length > 0) {
            this.attitudeOverallDist.series[0].data = parsedOverallDist
          } else {
            this.attitudeOverallDist.series[0].data = [
              {
                name: '暂无数据',
                value: 0,
              },
            ]
          }
        } else {
          this.showToast({
            message: `加载上一轮观点支持度填写结果的整体分布失败，${res.data.message}`,
            type: 'error',
          })
        }
      }).catch(error => {
        this.showToast({
          message: `加载上一轮观点支持度填写结果的整体分布失败，${error}`,
          type: 'error',
        })
      })

      this.isPriceOptionOverallDistLoaded = true
      this.priceOptionOverallDist.series = []
      getPriceOptionOverallDistribution(this.previousQuestionId).then(res => {
        if (res.data.status === StatusCode.SUCCESS) {
          const rawOverallDist = res.data.data.priceOptionOverallDist
          const parsedOverallDist = this.parsePriceOptionOverallDist(rawOverallDist)
          this.priceOptionOverallDist.series.push({})

          if (parsedOverallDist.length > 0) {
            this.priceOptionOverallDist.series[0].data = parsedOverallDist
          } else {
            this.priceOptionOverallDist.series[0].data = [
              {
                name: '暂无数据',
                value: 0,
              },
            ]
          }
        } else {
          this.showToast({
            message: `加载上一轮价钱问题填写结果的整体分布失败，${res.data.message}`,
            type: 'error',
          })
        }
      }).catch(error => {
        this.showToast({
          message: `加载上一轮价钱问题填写结果的整体分布失败，${error}`,
          type: 'error',
        })
      })

      this.isLengthOptionOverallDistLoaded = true
      this.lengthOptionOverallDist.series = []
      getLengthOptionOverallDistribution(this.previousQuestionId).then(res => {
        if (res.data.status === StatusCode.SUCCESS) {
          const rawOverallDist = res.data.data.lengthOptionOverallDist
          const parsedOverallDist = this.parseLengthOptionOverallDist(rawOverallDist)
          this.lengthOptionOverallDist.series.push({})

          if (parsedOverallDist.length > 0) {
            this.lengthOptionOverallDist.series[0].data = parsedOverallDist
          } else {
            this.lengthOptionOverallDist.series[0].data = [
              {
                name: '暂无数据',
                value: 0,
              },
            ]
          }
        } else {
          this.showToast({
            message: `加载上一轮时长问题填写结果的整体分布失败，${res.data.message}`,
            type: 'error',
          })
        }
      }).catch(error => {
        this.showToast({
          message: `加载上一轮时长问题填写结果的整体分布失败，${error}`,
          type: 'error',
        })
      })
    },
    submit() {
      this.$refs.basicInfoForm.validate().then(res => {
        const submission = this.submission

        if (parseInt(submission.opinionItem.attitude) < parseInt(this.attitudeQuestion.numberBoundaryQuestion.min) ||
            parseInt(submission.opinionItem.attitude) > parseInt(this.attitudeQuestion.numberBoundaryQuestion.max)) {
          this.showToast({
            message: `观点支持度值不合法：${submission.opinionItem.attitude}`,
            type: 'error',
          })

          return
        }

        if (this.shouldShowPriceQuestion) {
          if (!this.checkOptionKeyExists(this.priceQuestion.optionQuestion.option, submission.opinionItem.priceOptionKey)) {
            this.showToast({
              message: `价格选项不合法：${submission.opinionItem.priceOptionKey}`,
              type: 'error',
            })

            return
          }
        }

        if (this.shouldShowLengthQuestion) {
          if (!this.checkOptionKeyExists(this.lengthQuestion.optionQuestion.option, submission.opinionItem.lengthOptionKey)) {
            this.showToast({
              message: `时长选项不合法：${submission.opinionItem.lengthOptionKey}`,
              type: 'error',
            })

            return
          }
        }

        this.showToast({
          message: '提交中',
          type: 'loading',
        })

        submitAdvanced(this.submission).then(res => {
          if (res.data.status === StatusCode.SUCCESS) {
            this.showToast({
              message: '提交成功',
              type: 'success',
            })

            uni.navigateTo({
              url: '/pages/success/success',
            })
          } else {
            this.showToast({
              message: `提交失败，${res.data.message}`,
              type: 'error',
            })
          }
        }).catch(error => {
          this.showToast({
            message: `提交失败，${error}`,
            type: 'error',
          })
        })
      }).catch(errors => {
        if (errors.length > 0) {
          this.showToast({
            message: errors[0].message,
            type: 'error',
          })
        } else {
          this.showToast({
            message: errors,
            type: 'error',
          })
        }
      })
    },
    showToast(params) {
      this.$refs.toast.show({
        ...params,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #ffffff;
}

.questionnaire {
  width: 80%;
  height: 80%;
  margin-left: auto;
  margin-right: auto;
}

.questionnaire .questionnaire-cell {
}

.questionnaire .questionnaire-cell .opinion-dist-cell {
  margin-top: 10 rpx;
  margin-bottom: 10 rpx;
  padding: 20 rpx;
}

.questionnaire .questionnaire-cell .opinion-dist-cell .u-button {
  width: 50%;
}

.questionnaire .questionnaire-cell .opinion-dist-cell .chart-box {
}

.questionnaire .questionnaire-cell .u-radio {
  margin: 10 rpx;
}

.questionnaire-cell .el-slider {
  padding: 20 rpx;
  word-break: keep-all;
}
</style>
