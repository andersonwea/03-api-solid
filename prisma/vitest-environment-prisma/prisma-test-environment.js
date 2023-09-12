export default {
  transformMode: 'ssr',
  name: 'prisma',
  async setup() {
    console.log('Setup')

    return {
      async teardown() {
        console.log('Teardown')
      },
    }
  },
}
