<template>
	<view class="container">
		<view class="questionnaire">
			<view class="questionnaire-cell">
				<u--text type="primary" :bold="true" size="16" text="1. 基本信息"></u--text>

				<u--form :model="submission" :rules="basicInfoFormRules" ref="basicInfoForm">
					<u-form-item label="学号" :required="true" prop="studentId">
						<u--input prefixIcon="account" placeholder="请输入学号" v-model="submission.studentId"></u--input>
					</u-form-item>

					<u-form-item label="姓名" :required="true" prop="name">
						<u--input prefixIcon="account" placeholder="请输入姓名" v-model="submission.name"></u--input>
					</u-form-item>
				</u--form>
			</view>

			<u-gap></u-gap>

			<view class="questionnaire-cell">
				<u--text type="primary" :bold="true" size="16" text="2. 与班级同学整体的亲密度分值(1 - 10)"></u--text>

				<u-slider step="1" min="1" max="10" :showValue="true" v-model="submission.classmateIntimacy"></u-slider>
			</view>

			<u-gap></u-gap>

			<view class="questionnaire-cell">
				<u--text type="primary" :bold="true" size="16" text="3. 与舍友整体的亲密度分值(1 - 10)"></u--text>

				<u-slider step="1" min="1" max="10" :showValue="true" v-model="submission.roommateIntimacy"></u-slider>
			</view>

			<u-gap></u-gap>

			<view class="questionnaire-cell">
				<u--text type="primary" :bold="true" size="16" text="4. 请列出 1 至 3 位与你最亲密的同学及亲密度分值(1 - 10)"></u--text>

				<view class="questionnaire-friend-cell">
					<u--form :model="submission" :rules="friendInfoFormRules" ref="friendInfoForm">
						<view v-for="(friendItem, index) in submission.friendItemList" :key="index" :index="index">
							<view style="align-content: center;">
								<u-form-item label="姓名" :required="true" prop="'friendItemList.' + index + '.name'">
									<u--input prefixIcon="account" placeholder="请输入姓名"
										v-model="submission.friendItemList[index].name"></u--input>
								</u-form-item>

								<u-slider step="1" min="1" max="10" :showValue="true"
									v-model="submission.friendItemList[index].intimacy">
								</u-slider>

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
				<u--text type="primary" :bold="true" size="16" :text="'5. ' + questionContent"></u--text>

				<u--form :model="submission" :rules="opinionFormRules" ref="opinionForm">
					<u-form-item prop="opinionItem.attitude">
						<u-radio-group placement="row" size="20" @change="selectOpinion">
							<u-radio v-for="(opinion, index) in opinionList" :key="index" :label="opinion.text"
								:name="opinion.attitude"></u-radio>
						</u-radio-group>
					</u-form-item>
				</u--form>
			</view>

			<u-gap></u-gap>

			<view class="questionnaire-cell">
				<u-button type="primary" text="提交" @click="submit()"></u-button>
			</view>

			<u-toast ref="toast"></u-toast>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				questionId: 1,
				questionPhase: 0,
				questionContent: '',
				opinionList: [{
					attitude: 0,
					text: '有利于'
				}, {
					attitude: 1,
					text: '不利于'
				}],
				submission: {
					studentId: null,
					name: null,
					classmateIntimacy: 5,
					roommateIntimacy: 5,
					friendItemList: [{
						name: '',
						intimacy: 5,
					}],
					opinionItem: {
						questionId: null,
						attitude: null,
						opinion: null,
						phase: null
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
				friendInfoFormRules: {},
				opinionFormRules: {}
			}
		},
		onShow() {
			this.submission.opinionItem.questionId = this.questionId
			this.submission.opinionItem.phase = 0
			// TODO 加载问题
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
			selectOpinion(name) {
				this.submission.opinionItem.attitude = name
			},
			submit() {
				this.$refs.basicInfoForm.validate().then(res => {
					let submission = this.submission

					for (let i = 0; i < submission.friendItemList.length; i++) {
						let friendItem = submission.friendItemList[i]

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

					if (!(submission.opinionItem.attitude === 0 || submission.opinionItem.attitude === 1)) {
						this.showToast({
							message: '请选择观点',
							type: 'error'
						})

						return
					}

					console.error(JSON.stringify(submission))
				}).catch(errors => {
					this.showToast({
						message: errors[0].message,
						type: 'error'
					})
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
		margin-top: 10rpx;
		margin-right: auto;
	}
</style>
