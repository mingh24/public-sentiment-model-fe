<template>
	<view class="container">
		<u-skeleton rows="25" :loading="isLoading"> </u-skeleton>

		<view v-if="!isLoading" class="questionnaire">
			<view class="questionnaire-cell">
				<u--text type="primary" :bold="true" size="16" text="1. 基本信息"></u--text>

				<u--form :model="submission" :rules="basicInfoFormRules" ref="basicInfoForm">
					<u-form-item label="学号" :required="true" prop="studentId">
						<u--input prefixIcon="account" placeholder="请输入学号" v-model="submission.studentId">
						</u--input>
					</u-form-item>
				</u--form>
			</view>

			<u-gap></u-gap>

			<view class="questionnaire-cell">
				<u--text type="primary" :bold="true" size="16" text="2. 与班级同学整体的亲密度分值(1 - 10)"></u--text>

				<u-row justify="space-between" gutter="10">
					<u-col span="11">
						<el-slider :step="1" :min="1" :max="10" :show-tooltip="false" show-stops
							v-model="submission.classmateIntimacy">
						</el-slider>
					</u-col>

					<u-col span="1">
						<u--text type="primary" :bold="true" size="16" :text="submission.classmateIntimacy">
						</u--text>
					</u-col>
				</u-row>
			</view>

			<u-gap></u-gap>

			<view class="questionnaire-cell">
				<u--text type="primary" :bold="true" size="16" text="3. 与舍友整体的亲密度分值(1 - 10)"></u--text>

				<u-row justify="space-between" gutter="10">
					<u-col span="11">
						<el-slider :step="1" :min="1" :max="10" :show-tooltip="false" show-stops
							v-model="submission.roommateIntimacy">
						</el-slider>
					</u-col>

					<u-col span="1">
						<u--text type="primary" :bold="true" size="16" :text="submission.roommateIntimacy">
						</u--text>
					</u-col>
				</u-row>
			</view>

			<u-gap></u-gap>

			<view class="questionnaire-cell">
				<u--text type="primary" :bold="true" size="16" text="4. 请列出 1 至 3 位与您最亲密的同学及亲密度分值(1 - 10)">
				</u--text>

				<view class="questionnaire-friend-cell">
					<u--form :model="submission" :rules="friendInfoFormRules" ref="friendInfoForm">
						<view v-for="(friendItem, index) in submission.friendItemList" :key="index" :index="index">
							<view style="align-content: center;">
								<u-form-item label="姓名" :required="true" prop="'friendItemList.' + index + '.name'">
									<u--input prefixIcon="account" placeholder="请输入姓名"
										v-model="submission.friendItemList[index].name"></u--input>
								</u-form-item>

								<u-row justify="space-between" gutter="10">
									<u-col span="11">
										<el-slider :step="1" :min="1" :max="10" :show-tooltip="false" show-stops
											v-model="submission.friendItemList[index].intimacy"></el-slider>
									</u-col>

									<u-col span="1">
										<u--text type="primary" :bold="true" size="16"
											:text="submission.friendItemList[index].intimacy">
										</u--text>
									</u-col>
								</u-row>

								<u-button v-if="submission.friendItemList.length > 1" type="warning" text="删除"
									@click="removeFriendItem(index)">
								</u-button>

								<u-divider></u-divider>
							</view>
						</view>

						<u-button v-if="submission.friendItemList.length < 3" type="primary" text="添加"
							@click="addFriendItem()"></u-button>
					</u--form>
				</view>
			</view>

			<u-gap></u-gap>

			<view class="questionnaire-cell">
				<u--text type="primary" :bold="true" size="16" :text="'5. ' + basicQuestion.content"></u--text>

				<u-row justify="space-between" gutter="10">
					<u-col span="11">
						<el-slider :step="1" :min="basicQuestion.option.min" :max="basicQuestion.option.max"
							:marks="basicQuestion.option.marks" :show-tooltip="false" show-stops
							v-model="submission.opinionItem.attitude"></el-slider>
					</u-col>

					<u-col span="1">
						<u--text type="primary" :bold="true" size="16" :text="submission.opinionItem.attitude">
						</u--text>
					</u-col>
				</u-row>
			</view>

			<u-gap></u-gap>

			<view v-if="shouldShowPriceQuestion" class="questionnaire-cell">
				<u--text type="primary" :bold="true" size="16" :text="'6. ' + priceQuestion.content"></u--text>

				<u-radio-group placement="column" activeColor="#3c9cff" @change="selectPriceOpinion">
					<u-radio v-for="option in priceQuestion.option" :key="option.optionKey"
						:label="option.optionKey + '. ' + option.optionValue" :name="option.optionKey"></u-radio>
				</u-radio-group>
			</view>

			<u-gap></u-gap>

			<view v-if="shouldShowLengthQuestion" class="questionnaire-cell">
				<u--text type="primary" :bold="true" size="16" :text="'7. ' + lengthQuestion.content"></u--text>

				<u-radio-group placement="column" activeColor="#3c9cff" @change="selectLengthOpinion">
					<u-radio v-for="option in lengthQuestion.option" :key="option.optionKey"
						:label="option.optionKey + '. ' + option.optionValue" :name="option.optionKey"></u-radio>
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
	import {
		getQuestionByQuestionId
	} from '@/api/question'
	import {
		submitEssential
	} from '@/api/questionnaire'
	import StatusCode from '@/common/statusCode'

	export default {
		data() {
			return {
				isLoading: true,
				questionId: 1,
				basicQuestion: {
					content: null,
					option: null,
				},
				priceQuestion: {
					attitudeThreshold: null,
					content: null,
					option: null,
				},
				lengthQuestion: {
					attitudeThreshold: null,
					content: null,
					option: null,
				},
				submission: {
					studentId: null,
					classmateIntimacy: 5,
					roommateIntimacy: 5,
					friendItemList: [{
						name: '',
						intimacy: 5,
					}],
					opinionItem: {
						questionId: null,
						attitude: 5,
						priceOptionKey: null,
						lengthOptionKey: null,
						opinion: null,
					}
				},
				basicInfoFormRules: {
					'studentId': [{
							required: true,
							message: '请填写学号',
							trigger: ['blur', 'change'],
						},
						{
							pattern: /^\d{8}$/g,
							transform(value) {
								return String(value);
							},
							message: '学号只能包含8位数字',
							trigger: ['blur', 'change'],
						}
					],
					'name': [{
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					}, {
						pattern: /^[\u4e00-\u9fa5]+$/g,
						transform(value) {
							return String(value);
						},
						message: '姓名只能包含中文',
						trigger: ['blur', 'change'],
					}]
				},
				friendInfoFormRules: {}
			}
		},
		computed: {
			shouldShowPriceQuestion() {
				return parseInt(this.submission.opinionItem.attitude) > parseInt(this.priceQuestion.attitudeThreshold)
			},
			shouldShowLengthQuestion() {
				return parseInt(this.submission.opinionItem.attitude) > parseInt(this.lengthQuestion.attitudeThreshold)
			}
		},
		watch: {
			shouldShowPriceQuestion: function(val, oldVal) {
				if (val === false) {
					this.submission.opinionItem.priceOptionKey = null
				}
			},
			shouldShowLengthQuestion: function(val, oldVal) {
				if (val === false) {
					this.submission.opinionItem.lengthOptionKey = null
				}
			}
		},
		onShow() {
			this.submission.opinionItem.questionId = this.questionId

			getQuestionByQuestionId(this.questionId).then(res => {
				if (res.data.status === StatusCode.SUCCESS) {
					let questionContent = JSON.parse(res.data.data.content)
					questionContent.basicQuestion.option.marks = JSON.parse(questionContent.basicQuestion.option
						.marks)

					this.basicQuestion = questionContent.basicQuestion
					this.priceQuestion = questionContent.priceQuestion
					this.lengthQuestion = questionContent.lengthQuestion

					this.isLoading = false
				} else {
					this.showToast({
						message: res.data.message,
						type: 'error'
					})
				}
			}).catch(error => {
				this.showToast({
					message: error,
					type: 'error'
				})
			})
		},
		methods: {
			addFriendItem() {
				this.submission.friendItemList.push({
					name: '',
					intimacy: 5,
				})
			},
			removeFriendItem(index) {
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

					for (let i = 0; i < submission.friendItemList.length; i++) {
						const friendItem = submission.friendItemList[i]

						if (typeof friendItem.name != 'string' || friendItem.name.trim().length == 0) {
							this.showToast({
								message: `请填写亲密同学的姓名(第${i + 1}位)`,
								type: 'error'
							})

							return
						}

						if (/[^\u4e00-\u9fa5]/.test(friendItem.name)) {
							this.showToast({
								message: `亲密同学的姓名只能包含中文(第${i + 1}位)`,
								type: 'error'
							})

							return
						}
					}

					if (parseInt(submission.opinionItem.attitude) < parseInt(this.basicQuestion.option.min) ||
						parseInt(submission.opinionItem.attitude) > parseInt(this.basicQuestion.option.max)) {
						this.showToast({
							message: `观点支持度值不合法：${submission.opinionItem.attitude}`,
							type: 'error'
						})

						return
					}

					if (this.shouldShowPriceQuestion) {
						if (!this.checkOptionKeyExists(this.priceQuestion.option, submission.opinionItem
								.priceOptionKey)) {
							this.showToast({
								message: `价格选项不合法：${submission.opinionItem.priceOptionKey}`,
								type: 'error'
							})

							return
						}
					}

					if (this.shouldShowLengthQuestion) {
						if (!this.checkOptionKeyExists(this.lengthQuestion.option, submission.opinionItem
								.lengthOptionKey)) {
							this.showToast({
								message: `时长选项不合法：${submission.opinionItem.lengthOptionKey}`,
								type: 'error'
							})

							return
						}
					}

					this.showToast({
						message: '提交中',
						type: 'loading'
					})

					submitEssential(this.submission).then(res => {
						if (res.data.status === StatusCode.SUCCESS) {
							this.showToast({
								message: '提交成功',
								type: 'success'
							})

							uni.navigateTo({
								url: '/pages/success/success'
							})
						} else {
							this.showToast({
								message: res.data.message,
								type: 'error'
							})
						}
					}).catch(error => {
						this.showToast({
							message: error,
							type: 'error'
						})
					})
				}).catch(errors => {
					if (errors.length > 0) {
						this.showToast({
							message: errors[0].message,
							type: 'error'
						})
					} else {
						this.showToast({
							message: errors,
							type: 'error'
						})
					}
				})
			},
			showToast(params) {
				this.$refs.toast.show({
					...params
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #FFFFFF;
	}

	.questionnaire {
		width: 80%;
		height: 80%;
		margin-left: auto;
		margin-right: auto;
	}

	.questionnaire .questionnaire-cell {}

	.questionnaire .questionnaire-cell .questionnaire-friend-cell {
		margin-top: 10rpx;
		margin-bottom: 10rpx;
		padding: 20rpx;
	}

	.questionnaire .questionnaire-cell .questionnaire-friend-cell .u-button {
		width: 50%;
	}

	.questionnaire .questionnaire-cell .u-radio {
		margin: 10rpx;
	}

	.questionnaire-cell .el-slider {
		padding: 20rpx;
		word-break: keep-all;
	}
</style>
