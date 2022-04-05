<template>
	<view class="container">
		<view class="success">
			<u-icon name="checkmark-circle-fill" color="#19be6b" size="60"></u-icon>

			<u-gap></u-gap>

			<u--text align="center" text="您的问卷已经提交成功，感谢您的参与！"></u--text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #FFFFFF;
	}

	.success {
		width: 80%;
		height: 80%;
		margin-left: auto;
		margin-right: auto;
	}

	.success .u-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
