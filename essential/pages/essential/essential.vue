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
            ></u--input>
          </u-form-item>
        </u--form>

        <u-gap></u-gap>
      </view>

      <view class="questionnaire-cell">
        <u--text
            type="primary"
            :bold="true"
            size="16"
            :text="'2. ' + classmateIntimacyQuestion.numberBoundaryQuestion.content"
        ></u--text>

        <u-row justify="space-between" gutter="12">
          <u-col span="10">
            <el-slider
                :step="1"
                :min="classmateIntimacyQuestion.numberBoundaryQuestion.min"
                :max="classmateIntimacyQuestion.numberBoundaryQuestion.max"
                :marks="classmateIntimacyQuestion.numberBoundaryQuestion.marks"
                :show-tooltip="false"
                show-stops
                v-model="submission.classmateIntimacy"
            >
            </el-slider>
          </u-col>

          <u-col span="1">
            <u--text
                type="primary"
                :bold="true"
                size="16"
                :text="submission.classmateIntimacy"
            ></u--text>
          </u-col>
        </u-row>

        <u-gap></u-gap>
      </view>

      <view class="questionnaire-cell">
        <u--text
            type="primary"
            :bold="true"
            size="16"
            :text="'3. ' + roommateIntimacyQuestion.numberBoundaryQuestion.content"
        ></u--text>

        <u-row justify="space-between" gutter="12">
          <u-col span="10">
            <el-slider
                :step="1"
                :min="roommateIntimacyQuestion.numberBoundaryQuestion.min"
                :max="roommateIntimacyQuestion.numberBoundaryQuestion.max"
                :marks="roommateIntimacyQuestion.numberBoundaryQuestion.marks"
                :show-tooltip="false"
                show-stops
                v-model="submission.roommateIntimacy"
            >
            </el-slider>
          </u-col>

          <u-col span="1">
            <u--text
                type="primary"
                :bold="true"
                size="16"
                :text="submission.roommateIntimacy"
            >
            </u--text>
          </u-col>
        </u-row>

        <u-gap></u-gap>
      </view>

      <view class="questionnaire-cell">
        <u--text
            type="primary"
            :bold="true"
            size="16"
            :text="'4. ' + friendIntimacyQuestion.numberBoundaryQuestion.content"
        >
        </u--text>

        <view class="questionnaire-friend-cell">
          <u--form
              :model="submission"
              :rules="friendInfoFormRules"
              ref="friendInfoForm"
          >
            <view
                v-for="(friendItem, index) in submission.friendItemList"
                :key="index"
                :index="index"
            >
              <u-form-item
                  :label="'姓名' + (index + 1)"
                  :required="true"
                  prop="'friendItemList.' + index + '.name'"
              >
                <el-select
                    :clearable="true"
                    :filterable="true"
                    :remote="true"
                    placeholder="请输入姓名"
                    :remote-method="query => loadSelectorFriendList(query, index)"
                    :loading="friendSelector[index].isLoading"
                    v-model="submission.friendItemList[index].studentId"
                    @clear="clearSelectorFriendList($event, index)"
                >
                  <el-option
                      v-for="item in friendSelector[index].student"
                      :key="item.studentId"
                      :label="item.sclass + ' ' + item.name"
                      :value="item.studentId"
                  ></el-option>
                </el-select>
              </u-form-item>

              <u-row justify="space-between" gutter="12">
                <u-col span="10">
                  <el-slider
                      :step="1"
                      :min="friendIntimacyQuestion.numberBoundaryQuestion.min"
                      :max="friendIntimacyQuestion.numberBoundaryQuestion.max"
                      :marks="friendIntimacyQuestion.numberBoundaryQuestion.marks"
                      :show-tooltip="false"
                      show-stops
                      v-model="submission.friendItemList[index].intimacy"
                  ></el-slider>
                </u-col>

                <u-col span="1">
                  <u--text
                      type="primary"
                      :bold="true"
                      size="16"
                      :text="submission.friendItemList[index].intimacy"
                  ></u--text>
                </u-col>
              </u-row>

              <u-gap></u-gap>

              <u-button
                  v-if="submission.friendItemList.length > 1"
                  type="warning"
                  text="删除"
                  @click="removeFriendItem(index)"
              >
              </u-button>

              <u-divider></u-divider>
            </view>

            <u-button
                v-if="submission.friendItemList.length < 3"
                type="primary"
                text="添加"
                @click="addFriendItem()"
            ></u-button>
          </u--form>
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
            ></u--text>
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
import {getStudentByName} from '@/api/student'
import {submitEssential} from '@/api/questionnaire'
import StatusCode from '@/common/statusCode'

export default {
  data() {
    return {
      isLoading: true,
      shouldShowStatement: false,
      statement: undefined,
      questionId: 1,
      classmateIntimacyQuestion: {
        numberBoundaryQuestion: {
          content: undefined,
          min: undefined,
          max: undefined,
          marks: undefined,
        },
      },
      roommateIntimacyQuestion: {
        numberBoundaryQuestion: {
          content: undefined,
          min: undefined,
          max: undefined,
          marks: undefined,
        },
      },
      friendIntimacyQuestion: {
        numberBoundaryQuestion: {
          content: undefined,
          min: undefined,
          max: undefined,
          marks: undefined,
        },
      },
      friendSelector: [
        {
          isLoading: false,
          student: [],
        }
      ],
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
      submission: {
        studentId: undefined,
        classmateIntimacy: 5,
        roommateIntimacy: 5,
        friendItemList: [
          {
            studentId: undefined,
            intimacy: 5,
          },
        ],
        opinionItem: {
          questionId: undefined,
          attitude: 5,
          priceOptionKey: undefined,
          lengthOptionKey: undefined,
          view: undefined,
          hasRequestedOverallDist: undefined,
          hasRequestedIntimateDist: undefined,
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
        name: [
          {
            required: true,
            message: '请填写姓名',
            trigger: ['blur', 'change'],
          },
          {
            pattern: /^[\u4e00-\u9fa5]+$/g,
            transform(value) {
              return String(value)
            },
            message: '姓名只能包含中文',
            trigger: ['blur', 'change'],
          },
        ],
      },
      friendInfoFormRules: {},
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
      return 5
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
    attitudeQuestionContent() {
      return `${this.attitudeQuestionNumber}. ${this.attitudeQuestion.numberBoundaryQuestion.content}`
    },
    priceQuestionContent() {
      return `${this.priceQuestionNumber}. ${this.priceQuestion.optionQuestion.content}`
    },
    lengthQuestionContent() {
      return `${this.lengthQuestionNumber}. ${this.lengthQuestion.optionQuestion.content}`
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

    getQuestionByQuestionId(this.questionId).then(res => {
      if (res.data.status === StatusCode.SUCCESS) {
        this.statement = res.data.data.statement

        const questionContent = res.data.data.questionContent
        this.classmateIntimacyQuestion = questionContent.classmateIntimacyQuestion
        this.classmateIntimacyQuestion.numberBoundaryQuestion.marks = JSON.parse(this.classmateIntimacyQuestion.numberBoundaryQuestion.marks)
        this.roommateIntimacyQuestion = questionContent.roommateIntimacyQuestion
        this.roommateIntimacyQuestion.numberBoundaryQuestion.marks = JSON.parse(this.roommateIntimacyQuestion.numberBoundaryQuestion.marks)
        this.friendIntimacyQuestion = questionContent.friendIntimacyQuestion
        this.friendIntimacyQuestion.numberBoundaryQuestion.marks = JSON.parse(this.friendIntimacyQuestion.numberBoundaryQuestion.marks)
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
    loadSelectorFriendList(query, index) {
      query = query.trim()
      if (query !== '') {
        this.friendSelector[index].student = []
        this.friendSelector[index].isLoading = true
        getStudentByName(query).then(res => {
          if (res.data.status === StatusCode.SUCCESS) {
            this.friendSelector[index].student = res.data.data
            this.friendSelector[index].isLoading = false
          } else {
            this.showToast({
              message: `加载学生信息失败，${res.data.message}`,
              type: 'error',
            })
          }
        }).catch(error => {
          this.showToast({
            message: `加载学生信息失败，${error}`,
            type: 'error',
          })
        })
      } else {
        this.friendSelector[index].student = []
      }
    },
    clearSelectorFriendList(event, index) {
      this.friendSelector[index].student = []
    },
    addFriendItem() {
      this.friendSelector.push({
        isLoading: false,
        student: [],
      })
      this.submission.friendItemList.push({
        studentId: undefined,
        intimacy: 5,
      })
    },
    removeFriendItem(index) {
      this.friendSelector.splice(index, 1)
      this.submission.friendItemList.splice(index, 1)
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
    submit() {
      this.$refs.basicInfoForm.validate().then(res => {
        const submission = this.submission

        const friendToIndexMap = new Map()
        for (let i = 0; i < submission.friendItemList.length; i++) {
          const friendItem = submission.friendItemList[i]

          if (typeof friendItem.studentId !== 'number' || !/^\d{8}$/g.test(String(friendItem.studentId))) {
            this.showToast({
              message: `亲密好友填写有误（第${i + 1}名）`,
              type: 'error',
            })

            return
          }

          let existingFriendIndex = friendToIndexMap.get(friendItem.studentId)
          if (existingFriendIndex !== undefined) {
            this.showToast({
              message: `亲密好友不能重复（第${existingFriendIndex + 1}名和${i + 1}名）`,
              type: 'error',
            })

            return
          }

          friendToIndexMap.set(friendItem.studentId, i)

          if (friendItem.studentId === parseInt(submission.studentId)) {
            this.showToast({
              message: `亲密好友不能填自己（第${i + 1}名）`,
              type: 'error',
            })

            return
          }
        }

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

        submitEssential(this.submission).then(res => {
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

.questionnaire .questionnaire-cell .el-slider {
  padding: 20 rpx;
  word-break: keep-all;
}

.questionnaire .questionnaire-cell .questionnaire-friend-cell {
}

.questionnaire .questionnaire-cell .questionnaire-friend-cell .el-select {
  width: 100%;
}

.questionnaire .questionnaire-cell .questionnaire-friend-cell .u-button {
  width: 50%;
}
</style>
