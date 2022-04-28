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

        <u-gap></u-gap>
      </view>

      <view class="questionnaire-cell">
        <u--text
            type="primary"
            :bold="true"
            size="16"
            text="2. 上一轮填写中全体同学的观点分布"
        ></u--text>

        <view v-if="isOverallDistLoaded" class="opinion-dist-cell">
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

        <view v-if="isOverallDistLoaded" class="opinion-dist-cell">
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

        <view v-if="isOverallDistLoaded" class="opinion-dist-cell">
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

        <u-gap></u-gap>
      </view>

      <view class="questionnaire-cell">
        <u--text
            type="primary"
            :bold="true"
            size="16"
            text="3. 上一轮填写中与您亲密度较高的同学的观点分布"
        ></u--text>

        <view v-if="isIntimateDistLoaded" class="opinion-dist-cell">
          <u--text
              type="default"
              :bold="true"
              size="14"
              :text="'3.1 针对“' + previousQuestionContent.attitudeQuestion.numberBoundaryQuestion.content + '”这一问题，上一轮填写中与您亲密度较高的同学观点的分布为'"
          ></u--text>

          <view class="charts-box">
            <qiun-data-charts
                type="customrose"
                :chartData="attitudeIntimateDist"
                :loadingType="5"
                background="none"
            />
          </view>
        </view>

        <view v-if="isIntimateDistLoaded" class="opinion-dist-cell">
          <u--text
              type="default"
              :bold="true"
              size="14"
              :text="'3.2 针对“' + previousQuestionContent.priceQuestion.optionQuestion.content + '”这一问题，上一轮填写中与您亲密度较高的同学观点的分布为'"
          ></u--text>

          <view class="charts-box">
            <qiun-data-charts
                type="customrose"
                :chartData="priceOptionIntimateDist"
                :loadingType="5"
                background="none"
            />
          </view>
        </view>

        <view v-if="isIntimateDistLoaded" class="opinion-dist-cell">
          <u--text
              type="default"
              :bold="true"
              size="14"
              :text="'3.3 针对“' + previousQuestionContent.lengthQuestion.optionQuestion.content + '”这一问题，上一轮填写中与您亲密度较高的同学观点的分布为'"
          ></u--text>

          <view class="chart-box">
            <qiun-data-charts
                type="customrose"
                :chartData="lengthOptionIntimateDist"
                :loadingType="5"
                background="none"
            />
          </view>
        </view>

        <view class="opinion-dist-cell">
          <u-button
              type="primary"
              text="获取观点分布"
              @click="fetchAllIntimateDist"
          ></u-button>
        </view>

        <u-gap></u-gap>
      </view>

      <view class="questionnaire-cell">
        <u--text
            type="primary"
            :bold="true"
            size="16"
            :text="attitudeQuestionContent"
        ></u--text>

        <u-row justify="space-between" gutter="12">
          <u-col span="10">
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

        <u-gap></u-gap>
      </view>

      <view v-if="shouldShowPriceQuestion" class="questionnaire-cell">
        <u--text
            type="primary"
            :bold="true"
            size="16"
            :text="priceQuestionContent"
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
              :customStyle="{marginTop: '20rpx'}"
          ></u-radio>
        </u-radio-group>

        <u-gap></u-gap>
      </view>

      <view v-if="shouldShowLengthQuestion" class="questionnaire-cell">
        <u--text
            type="primary"
            :bold="true"
            size="16"
            :text="lengthQuestionContent"
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
              :customStyle="{marginTop: '20rpx'}"
          ></u-radio>
        </u-radio-group>

        <u-gap></u-gap>
      </view>

      <view class="questionnaire-cell">
        <u--text
            type="primary"
            :bold="true"
            size="16"
            :text="viewQuestionContent"
        ></u--text>

        <u--form
            :model="submission"
        >
          <u-form-item>
            <u--textarea
                placeholder="请输入内容"
                v-model="submission.opinionItem.view"
            ></u--textarea>
          </u-form-item>
        </u--form>

        <u-gap></u-gap>
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
  getLengthOptionOverallDistribution,
  getAttitudeIntimateDistribution,
  getPriceOptionIntimateDistribution,
  getLengthOptionIntimateDistribution,
} from '@/api/opinion'
import {submitAdvanced} from '@/api/questionnaire'
import StatusCode from '@/common/statusCode'

export default {
  data() {
    return {
      isLoading: true,
      shouldShowStatement: false,
      statement: undefined,
      questionId: 3,
      previousQuestionId: 2,
      previousQuestionContent: undefined,
      isOverallDistLoaded: false,
      attitudeOverallDist: {
        categories: [],
        series: [
          {
            data: [],
          },
        ],
      },
      priceOptionOverallDist: {
        categories: [],
        series: [
          {
            data: [],
          },
        ],
      },
      lengthOptionOverallDist: {
        categories: [],
        series: [
          {
            data: [],
          },
        ],
      },
      isIntimateDistLoaded: false,
      attitudeIntimateDist: {
        categories: [],
        series: [
          {
            data: [],
          },
        ],
      },
      priceOptionIntimateDist: {
        categories: [],
        series: [
          {
            data: [],
          },
        ],
      },
      lengthOptionIntimateDist: {
        categories: [],
        series: [
          {
            data: [],
          },
        ],
      },
      attitudeQuestion: {
        numberBoundaryQuestion: {
          content: undefined,
          min: undefined,
          max: undefined,
          marks: undefined,
        },
      },
      priceQuestion: {
        attitudeThreshold: undefined,
        optionQuestion: {
          content: undefined,
          option: undefined,
        },
      },
      lengthQuestion: {
        attitudeThreshold: undefined,
        optionQuestion: {
          content: undefined,
          option: undefined,
        },
      },
      viewQuestion: {
        textFillingQuestion: {
          content: undefined,
        }
      },
      submission: {
        studentId: undefined,
        opinionItem: {
          questionId: undefined,
          attitude: 5,
          priceOptionKey: undefined,
          lengthOptionKey: undefined,
          view: undefined,
          hasRequestedOverallDist: false,
          hasRequestedIntimateDist: false,
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
    attitudeQuestionNumber() {
      return 4
    },
    priceQuestionNumber() {
      return this.attitudeQuestionNumber + 1
    },
    lengthQuestionNumber() {
      let number = this.attitudeQuestionNumber + 1

      if (this.shouldShowPriceQuestion) {
        number += 1
      }

      return number
    },
    viewQuestionNumber() {
      let number = this.attitudeQuestionNumber + 1

      if (this.shouldShowPriceQuestion) {
        number += 1
      }

      if (this.shouldShowLengthQuestion) {
        number += 1
      }

      return number
    },
    attitudeQuestionContent() {
      return `${this.attitudeQuestionNumber}. ${this.attitudeQuestion.numberBoundaryQuestion.content}`
    },
    priceQuestionContent() {
      return `${this.priceQuestionNumber}. ${this.priceQuestion.optionQuestion.content}`
    },
    lengthQuestionContent() {
      return `${this.lengthQuestionNumber}. ${this.lengthQuestion.optionQuestion.content}`
    },
    viewQuestionContent() {
      return `${this.viewQuestionNumber}. ${this.viewQuestion.textFillingQuestion.content}`
    },
  },
  watch: {
    shouldShowStatement: function (val, oldVal) {
      this.shouldShowStatement = this.shouldShowStatement && this.statement !== undefined
    },
    shouldShowPriceQuestion: function (val, oldVal) {
      if (val === false) {
        this.submission.opinionItem.priceOptionKey = undefined
      }
    },
    shouldShowLengthQuestion: function (val, oldVal) {
      if (val === false) {
        this.submission.opinionItem.lengthOptionKey = undefined
      }
    },
  },
  onShow() {
    this.submission.opinionItem.questionId = this.questionId
    this.submission.opinionItem.hasRequestedOverallDist = false
    this.submission.opinionItem.hasRequestedIntimateDist = false
    this.isOverallDistLoaded = false
    this.isIntimateDistLoaded = false

    this.attitudeOverallDist = {
      categories: [],
      series: [
        {
          data: [],
        },
      ],
    }

    this.priceOptionOverallDist = {
      categories: [],
      series: [
        {
          data: [],
        },
      ],
    }

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
        this.statement = res.data.data.statement
        this.previousQuestionId = res.data.data.previousQuestionId

        const questionContent = res.data.data.questionContent
        this.attitudeQuestion = questionContent.attitudeQuestion
        this.attitudeQuestion.numberBoundaryQuestion.marks = JSON.parse(this.attitudeQuestion.numberBoundaryQuestion.marks)
        this.priceQuestion = questionContent.priceQuestion
        this.lengthQuestion = questionContent.lengthQuestion
        this.viewQuestion = questionContent.viewQuestion

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
    parseAttitudeIntimateDist(rawDist) {
      const data = []

      for (let i = 0; i < rawDist.length; i++) {
        data.push({
          name: rawDist[i].name,
          value: rawDist[i].count,
        })
      }

      return data
    },
    parsePriceOptionIntimateDist(rawDist) {
      const data = []

      for (let i = 0; i < rawDist.length; i++) {
        data.push({
          name: rawDist[i].name,
          value: rawDist[i].count,
        })
      }

      return data
    },
    parseLengthOptionIntimateDist(rawDist) {
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
      this.isOverallDistLoaded = false
      getQuestionByQuestionId(this.previousQuestionId).then(res => {
        if (res.data.status === StatusCode.SUCCESS) {
          this.previousQuestionContent = res.data.data.questionContent
          this.previousQuestionContent.attitudeQuestion.numberBoundaryQuestion.marks = JSON.parse(this.previousQuestionContent.attitudeQuestion.numberBoundaryQuestion.marks)
          this.isOverallDistLoaded = true
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

      this.attitudeOverallDist.series = []
      getAttitudeOverallDistribution(this.previousQuestionId).then(res => {
        if (res.data.status === StatusCode.SUCCESS) {
          const rawOverallDist = res.data.data.attitudeOverallDist
          const parsedOverallDist = this.parseAttitudeOverallDist(rawOverallDist)

          if (parsedOverallDist.length > 0) {
            this.attitudeOverallDist.series = [
              {
                data: parsedOverallDist,
              },
            ]
          } else {
            this.attitudeOverallDist.series = [
              {
                data: [
                  {
                    name: '暂无数据',
                    value: 0,
                  },
                ],
              },
            ]
          }
        } else {
          this.showToast({
            message: `加载上一轮观点支持度填写结果整体的分布失败，${res.data.message}`,
            type: 'error',
          })

          this.attitudeOverallDist.series = [
            {
              data: [
                {
                  name: '暂无数据',
                  value: 0,
                },
              ],
            },
          ]
        }
      }).catch(error => {
        this.showToast({
          message: `加载上一轮观点支持度填写结果整体的分布失败，${error}`,
          type: 'error',
        })

        this.attitudeOverallDist.series = [
          {
            data: [
              {
                name: '暂无数据',
                value: 0,
              },
            ],
          },
        ]
      })

      this.priceOptionOverallDist.series = []
      getPriceOptionOverallDistribution(this.previousQuestionId).then(res => {
        if (res.data.status === StatusCode.SUCCESS) {
          const rawOverallDist = res.data.data.priceOptionOverallDist
          const parsedOverallDist = this.parsePriceOptionOverallDist(rawOverallDist)

          if (parsedOverallDist.length > 0) {
            this.priceOptionOverallDist.series = [
              {
                data: parsedOverallDist,
              },
            ]
          } else {
            this.priceOptionOverallDist.series = [
              {
                data: [
                  {
                    name: '暂无数据',
                    value: 0,
                  },
                ],
              },
            ]
          }
        } else {
          this.showToast({
            message: `加载上一轮价格问题填写结果整体的分布失败，${res.data.message}`,
            type: 'error',
          })

          this.priceOptionOverallDist.series = [
            {
              data: [
                {
                  name: '暂无数据',
                  value: 0,
                },
              ],
            },
          ]
        }
      }).catch(error => {
        this.showToast({
          message: `加载上一轮价格问题填写结果整体的分布失败，${error}`,
          type: 'error',
        })

        this.priceOptionOverallDist.series = [
          {
            data: [
              {
                name: '暂无数据',
                value: 0,
              },
            ],
          },
        ]
      })

      this.lengthOptionOverallDist.series = []
      getLengthOptionOverallDistribution(this.previousQuestionId).then(res => {
        if (res.data.status === StatusCode.SUCCESS) {
          const rawOverallDist = res.data.data.lengthOptionOverallDist
          const parsedOverallDist = this.parseLengthOptionOverallDist(rawOverallDist)

          if (parsedOverallDist.length > 0) {
            this.lengthOptionOverallDist.series = [
              {
                data: parsedOverallDist,
              },
            ]
          } else {
            this.lengthOptionOverallDist.series = [
              {
                data: [
                  {
                    name: '暂无数据',
                    value: 0,
                  },
                ],
              },
            ]
          }
        } else {
          this.showToast({
            message: `加载上一轮时长问题填写结果整体的分布失败，${res.data.message}`,
            type: 'error',
          })

          this.lengthOptionOverallDist.series = [
            {
              data: [
                {
                  name: '暂无数据',
                  value: 0,
                },
              ],
            },
          ]
        }
      }).catch(error => {
        this.showToast({
          message: `加载上一轮时长问题填写结果整体的分布失败，${error}`,
          type: 'error',
        })

        this.lengthOptionOverallDist.series = [
          {
            data: [
              {
                name: '暂无数据',
                value: 0,
              },
            ],
          },
        ]
      })

      this.submission.opinionItem.hasRequestedOverallDist = true
    },
    fetchAllIntimateDist() {
      if (!/^\d{8}$/g.test(String(this.submission.studentId))) {
        this.showToast({
          message: `学号输入有误`,
          type: 'error',
        })

        return
      }

      this.isIntimateDistLoaded = false
      getQuestionByQuestionId(this.previousQuestionId).then(res => {
        if (res.data.status === StatusCode.SUCCESS) {
          this.previousQuestionContent = res.data.data.questionContent
          this.previousQuestionContent.attitudeQuestion.numberBoundaryQuestion.marks = JSON.parse(this.previousQuestionContent.attitudeQuestion.numberBoundaryQuestion.marks)
          this.isIntimateDistLoaded = true
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

      this.attitudeIntimateDist.series = []
      getAttitudeIntimateDistribution(this.submission.studentId, this.previousQuestionId).then(res => {
        if (res.data.status === StatusCode.SUCCESS) {
          if (res.data.message !== 'success') {
            this.showToast({
              message: res.data.message,
              type: 'default',
            })
          }

          const rawIntimateDist = res.data.data.attitudeIntimateDist
          const parsedIntimateDist = this.parseAttitudeIntimateDist(rawIntimateDist)

          if (parsedIntimateDist.length > 0) {
            this.attitudeIntimateDist.series = [
              {
                data: parsedIntimateDist,
              },
            ]
          } else {
            this.attitudeIntimateDist.series = [
              {
                data: [
                  {
                    name: '暂无数据',
                    value: 0,
                  },
                ],
              },
            ]
          }
        } else {
          this.showToast({
            message: `加载上一轮观点支持度填写结果在亲密同学中的分布失败，${res.data.message}`,
            type: 'error',
          })

          this.attitudeIntimateDist.series = [
            {
              data: [
                {
                  name: '暂无数据',
                  value: 0,
                },
              ],
            },
          ]
        }
      }).catch(error => {
        this.showToast({
          message: `加载上一轮观点支持度填写结果在亲密同学中的分布失败，${error}`,
          type: 'error',
        })

        this.attitudeIntimateDist.series = [
          {
            data: [
              {
                name: '暂无数据',
                value: 0,
              },
            ],
          },
        ]
      })

      this.priceOptionIntimateDist.series = []
      getPriceOptionIntimateDistribution(this.submission.studentId, this.previousQuestionId).then(res => {
        if (res.data.status === StatusCode.SUCCESS) {
          if (res.data.message !== 'success') {
            this.showToast({
              message: res.data.message,
              type: 'default',
            })
          }

          const rawIntimateDist = res.data.data.priceOptionIntimateDist
          const parsedIntimateDist = this.parsePriceOptionIntimateDist(rawIntimateDist)

          if (parsedIntimateDist.length > 0) {
            this.priceOptionIntimateDist.series = [
              {
                data: parsedIntimateDist,
              },
            ]
          } else {
            this.priceOptionIntimateDist.series = [
              {
                data: [
                  {
                    name: '暂无数据',
                    value: 0,
                  },
                ],
              },
            ]
          }
        } else {
          this.showToast({
            message: `加载上一轮价格问题填写结果在亲密同学中的分布失败，${res.data.message}`,
            type: 'error',
          })

          this.priceOptionIntimateDist.series = [
            {
              data: [
                {
                  name: '暂无数据',
                  value: 0,
                },
              ],
            },
          ]
        }
      }).catch(error => {
        this.showToast({
          message: `加载上一轮价格问题填写结果在亲密同学中的分布失败，${error}`,
          type: 'error',
        })

        this.priceOptionIntimateDist.series = [
          {
            data: [
              {
                name: '暂无数据',
                value: 0,
              },
            ],
          },
        ]
      })

      this.lengthOptionIntimateDist.series = []
      getLengthOptionIntimateDistribution(this.submission.studentId, this.previousQuestionId).then(res => {
        if (res.data.status === StatusCode.SUCCESS) {
          if (res.data.message !== 'success') {
            this.showToast({
              message: res.data.message,
              type: 'default',
            })
          }

          const rawIntimateDist = res.data.data.lengthOptionIntimateDist
          const parsedIntimateDist = this.parseLengthOptionIntimateDist(rawIntimateDist)

          if (parsedIntimateDist.length > 0) {
            this.lengthOptionIntimateDist.series = [
              {
                data: parsedIntimateDist,
              },
            ]
          } else {
            this.lengthOptionIntimateDist.series = [
              {
                data: [
                  {
                    name: '暂无数据',
                    value: 0,
                  },
                ],
              },
            ]
          }
        } else {
          this.showToast({
            message: `加载上一轮时长问题填写结果在亲密同学中的分布失败，${res.data.message}`,
            type: 'error',
          })

          this.lengthOptionIntimateDist.series = [
            {
              data: [
                {
                  name: '暂无数据',
                  value: 0,
                },
              ],
            },
          ]
        }
      }).catch(error => {
        this.showToast({
          message: `加载上一轮时长问题填写结果在亲密同学中的分布失败，${error}`,
          type: 'error',
        })

        this.lengthOptionIntimateDist.series = [
          {
            data: [
              {
                name: '暂无数据',
                value: 0,
              },
            ],
          },
        ]
      })

      this.submission.opinionItem.hasRequestedIntimateDist = true
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

.questionnaire .questionnaire-cell .el-slider {
  padding: 20 rpx;
  word-break: keep-all;
}

.questionnaire .questionnaire-cell .u-radio {
  margin: 10 rpx;
}
</style>
