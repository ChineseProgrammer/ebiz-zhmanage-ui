<template>
  <div class="steps">
    <div
      v-bind:class="[stepArray.length==2 ? 'width-2' : stepArray.length==3?'width-3':'width-4', '']"
      v-for="(item,index) in stepArray"
      :key="index"
    >
      <div v-if="errorStep<=0" class="width-100">
        <div
          class
          v-bind:class="[index<currentVal ? 'color-pick circle' : 'color-no-pick circle-no-border', '']"
        ></div>
        <p
          v-show="index!=0"
          class="line-1"
          v-bind:class="[index<currentVal ? 'color-pick' : 'color-no-pick', '']"
        ></p>
        <p
          v-show="index!=stepArray.length-1"
          class="line-2"
          v-bind:class="[index<currentVal-1 ? 'color-pick' : 'color-no-pick', '']"
        ></p>
      </div>
      <div v-else class="width-100">
        <div
          class
          v-bind:class="[index<errorStep ? 'color-pick circle' : index==errorStep?'color-pick circle-error' :'color-no-pick circle-no-border', '']"
        ></div>
        <p
          v-show="index!=0"
          class="line-1"
          v-bind:class="[index<errorStep ? 'color-pick' :index==errorStep?'color-error-pick-1' :'color-no-pick', '']"
        ></p>
        <p
          v-show="index!=stepArray.length-1"
          class="line-2"
          v-bind:class="[index<errorStep-1 ? 'color-pick' :index==errorStep-1?'color-error-pick-2' :'color-no-pick', '']"
        ></p>
      </div>
      <div class="width-100 mt-b mt-20">
        <p class="title">{{item}}</p>
      </div>
      <div class="width-100 mt-b">
        <p class="time">{{stepTimeArray[index]}}</p>
      </div>
    </div>
  </div>
</template>
<style scoped >
.steps {
  background: #fff;
  display: flex;
  /*justify-content: space-evenly;*/
  align-items: flex-end;
  width: 100%;
  overflow: hidden;
  text-align: center;
  padding: 16px 0;
}
.line-1 {
  width: 50%;
  height: 2px;
  position: absolute;
  z-index: 0;
  left: 0;
  top: 3px;
}
.line-2 {
  width: 50%;
  height: 2px;
  position: absolute;
  z-index: 0;
  top: 3px;
  left: 50%;
}
.mt-b {
  margin-bottom: 4px;
}
.mt-20 {
  margin-top: 20px;
}
.color-pick {
  background: #17a14c;
  /*border-color: rgba(0,122,255,.3);*/
}
.color-no-pick {
  background: #dddee3;
}
.color-error-pick-1 {
  background-image: linear-gradient(90deg, #b377f6 0%, #df3031 100%);
}
.color-error-pick-2 {
  background-image: linear-gradient(
    90deg,
    #007aff 0%,
    #8091ff 60%,
    #b377f6 100%
  );
}
.width-100 {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
}
.title {
  width: 150px;
  font-weight: 700;
  line-height: 18px;
  height: 18px;
  font-size: 14px;
  color: #666666;
}
.time {
  width: 150px;
  font-weight: 400;
  line-height: 18px;
  height: 18px;
  font-size: 12px;
  color: #999999;
}
.width-2 {
  width: 50%;
}
.width-3 {
  width: 33.33%;
}
.width-4 {
  width: 25%;
}
.circle {
  width: 8px;
  height: 8px;
  /*border: 2px solid #fff;*/
  border-radius: 50%;
  /*background: #007AFF;*/
  z-index: 9;
}
.circle-error {
  width: 8px;
  height: 8px;
  /*border: 2px solid #fff;*/
  border-radius: 50%;
  background: #df3031;
  z-index: 9;
}
.circle-no-border {
  width: 8px;
  height: 8px;
  /*border: 2px solid #fff;*/
  border-radius: 50%;
  /*background: #007AFF;*/
  z-index: 9;
}
.circle-no-border::before {
  display: inline-block;
  content: "";
  width: 8px;
  height: 8px;
  background: #dddee3;
  position: absolute;
  top: -2px;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  border: 2px solid #fff;
}
.circle::after {
  display: inline-block;
  content: "";
  width: 12px;
  height: 12px;
  background: rgba(0, 122, 255, 0.15);
  position: absolute;
  top: -2px;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
}
.circle-error::after {
  display: inline-block;
  content: "";
  width: 12px;
  height: 12px;
  background: rgba(223, 48, 49, 0.15);
  position: absolute;
  top: -2px;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
}
</style>
<script>
export default {
  data() {
    return {};
  },
  props: {
    currentVal: {
      type: Number,
      default: 0
    },
    errorStep: {
      type: Number,
      default: 0
    },
    stepArray: {
      type: Array,
      default: function() {
        return [];
      }
    },
    stepTimeArray: {
      type: Array,
      default: function() {
        return [];
      }
    }
  }
};
</script>