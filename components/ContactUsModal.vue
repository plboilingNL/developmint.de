<template>
  <transition name="animodal" appear>
    <div class="fixed top-0 w-full h-screen bg-rains-trans-500 z-20 overflow-hidden md:overflow-y-scroll text-white p-4 lg:p-8 lg:pt-0 xl:p-16 text-2xl lg:text-3xl transition-all">
      <button
        class="close-button modal-close"
        @click="$emit('close')"
      />
      <div class="m-4 mt-0 lg:m-16 xl:m-32 mx-auto flex flex-col items-center justify-center animodal-inner">
        <h2 class="text-white text-2xl md:text-3xl xl:text-5xl text-center lg:text-left capitalize font-normal mb-2 lg:mb-4 xl:mb-8">
          {{ $t('contact.heading') }}
        </h2>
        <form
          v-show="!isSubmitted"
          class=" w-5/6 lg:w-2/3 xl:w-1/3 mx-auto flex flex-col items-center text-sm"
          @submit.prevent="validate"
        >
          <div
            :class="{'shadow-white': focusedElement === 'name', 'shadow-red': $v.name.$error}"
            class="bg-gray-300 inline-flex rounded items-center px-4 border-white transition-all w-full my-2"
          >
            <label
              for="name"
              class="text-developmint-700 whitespace-no-wrap"
            >
              Name
            </label>
            <input
              id="name"
              v-model.trim="$v.name.$model"
              class="appearance-none bg-transparent py-4 px-2 mx-2 md:mx-0 md:px-8 w-5/6 md:w-full text-developmint-800"
              type="text"
              @focus="focusedElement = 'name'"
              @blur="focusedElement = ''"
            >
          </div>
          <span
            v-show="$v.name.$error"
            class="text-sm self-start ml-2 mb-4 text-red-400"
          >
            {{ $t('contact.errors.name') }}
          </span>
          <div
            :class="{'shadow-white': focusedElement === 'email', 'shadow-red': $v.email.$error}"
            class="bg-gray-300 inline-flex rounded items-center px-4 border-white transition-all w-full my-2"
          >
            <label
              for="email"
              class="text-developmint-700 whitespace-no-wrap"
            >
              E-Mail
            </label>
            <input
              id="email"
              v-model.trim="$v.email.$model"
              class="appearance-none bg-transparent py-4 px-2 mx-2 md:mx-0 md:px-8 w-5/6 md:w-full text-developmint-800"
              type="email"
              @focus="focusedElement = 'email'"
              @blur="focusedElement = ''"
            >
          </div>
          <span
            v-show="$v.email.$error"
            class="text-sm self-start ml-2 mb-4 text-red-400"
          >
            {{ $t('contact.errors.email') }}
          </span>
          <div
            :class="{'shadow-white': focusedElement === 'msg', 'shadow-red': $v.msg.$error}"
            class="bg-gray-300 inline-flex flex-col rounded px-4 border-white transition-all w-full my-2"
          >
            <label
              for="msg"
              class="py-4 text-developmint-700"
            >
              {{ $t('contact.fields.tell') }}
            </label>
            <textarea
              id="msg"
              v-model.trim="$v.msg.$model"
              class="appearance-none bg-transparent text-developmint-800 resize-none"
              rows="6"
              @focus="focusedElement='msg'"
              @blur="focusedElement = ''"
            />
          </div>
          <span
            v-show="$v.msg.$error"
            class="text-xm self-start ml-2 mb-4 text-red-400"
          >
            {{ $t('contact.errors.message') }}
          </span>
          <p class="text-xs md:text-sm my-4 px-2 text-gray-light">
            {{ $t('contact.privacy.text') }}
            <NuxtLink
              :to="localePath('privacy')"
              tabindex="-1"
              class="text-white underline hover:text-developmint-300"
            >
              {{ $t('contact.privacy.policy') }}
            </NuxtLink>
          </p>
          <div class="flex justify-between lg:block lg:ml-auto">
            <button
              class="lg:hidden mr-4 mt-4 rounded hover:border-yellow-500 transition-all hover:text-yellow px-6 py-3 border border-yellow-400 text-gray-300"
              @click.prevent="$emit('close')"
            >
              {{ $t('contact.buttons.back') }}
            </button>
            <button
              :class="submitButtonClasses"
              :disabled="submissionDisabled"
              type="submit"
            >
              {{ $t('contact.buttons.submit') }}
            </button>
          </div>
        </form>
        <div
          v-show="isSubmitted"
          class="text-2xl text-developmint-500"
        >
          {{ $t('contact.message.success') }}
        </div>
        <div
          v-if="error"
          class="text-2xl text-red-600"
        >
          {{ $t('contact.message.error') }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { validationMixin } from 'vuelidate/src/index'
import { email, minLength, required } from 'vuelidate/src/validators'

export default {
  mixins: [validationMixin],
  data () {
    return {
      name: '',
      email: '',
      msg: '',
      focusedElement: '',
      submitting: false,
      isSubmitted: false,
      error: false
    }
  },
  validations: {
    name: {
      required
    },
    email: {
      required,
      email
    },
    msg: {
      required,
      minLength: minLength(25)
    }
  },
  computed: {
    empty () {
      const dataKeys = ['name', 'email', 'msg']

      return dataKeys.some(k => !this[k])
    },
    submissionDisabled () {
      return this.empty || this.$v.$error || this.submitting
    },
    submitButtonClasses () {
      const baseClasses = 'ml-4 mt-4 px-6 py-3 rounded transition-all border text-gray-300'
      const additionalClasses = this.submissionDisabled
        ? 'opacity-50 cursor-not-allowed border-gray--300'
        : 'hover:bg-gradient-rains-dark-rains border-developmint-400 hover:border-developmint-500'

      return `${baseClasses} ${additionalClasses}`
    }
  },
  mounted () {
    const keyHandler = (event) => {
      if (event.keyCode !== 27) {
        return
      }

      this.$emit('close')
    }

    window.addEventListener('keyup', keyHandler)
    this.$once('hook:destroyed', () => {
      document.removeEventListener('keydown', keyHandler)
    })
  },
  methods: {
    validate () {
      if (this.submissionDisabled) {
        return
      }

      this.submitForm()
    },
    async submitForm () {
      this.submitting = true
      this.$ga.event('submit', 'form', this.$i18n.locale)
      this.error = false
      try {
        await this.$axios.$post('contact', {
          name: this.name,
          email: this.email,
          msg: this.msg
        })
        this.submitting = false
        this.isSubmitted = true
        await new Promise(resolve => setTimeout(resolve, 2500))
        this.$emit('close')
      } catch (e) {
        this.submitting = false
        this.error = true
        // eslint-disable-next-line no-console
        console.error(e)
      }
    }
  }
}
</script>

<style lang="postcss">
  textarea:focus, input:focus {
    outline: none;
  }

  :invalid {
    box-shadow: none;
  }

  :-moz-submit-invalid {
    box-shadow: none;
  }

  :-moz-ui-invalid {
    box-shadow: none;
  }

  .shadow-white {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
  }

  .shadow-red {
    box-shadow: 0 0 0 2px theme("colors.red.500");
  }

  .close-button {
    @apply .hidden .font-mono .ml-auto .text-gray-400 .text-xl .w-8 .h-8 .rounded-full .border .mt-2;

    &::before {
      content: '×'
    }

    @screen lg {
      @apply .block;
    }
  }
</style>
