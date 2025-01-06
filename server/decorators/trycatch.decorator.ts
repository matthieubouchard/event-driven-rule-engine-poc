import { Logger } from '@nestjs/common'

interface CatchOptions {
  defaultValue?: any | ((...args: any[]) => any)
  rethrow?: boolean
  logLevel?: 'log' | 'error' | 'warn' | 'debug' | 'verbose'
}

export function TryCatch(options: CatchOptions = {}) {
  const logger = new Logger('ErrorHandler')

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // Store the original method
    const originalMethod = descriptor.value

    // Replace the original method with our error handling wrapper
    descriptor.value = async function (...args: any[]) {
      try {
        // Execute the original method
        const result = await originalMethod.apply(this, args)
        return result
      } catch (error) {
        // Get the class name
        const className = target.constructor.name

        // Construct error message
        const errorMessage = `Error in ${className}.${propertyKey}: ${error.message}`

        // Log the error using the specified log level or default to error
        const logLevel = options.logLevel || 'error'
        logger[logLevel](errorMessage, {
          className,
          methodName: propertyKey,
          args,
          stack: error.stack,
        })

        // If rethrow is true, throw the error
        if (options.rethrow) {
          throw error
        }

        // Handle default value
        if (typeof options.defaultValue === 'function') {
          const defaultResult = options.defaultValue.apply(this, args)
          // Handle if the default value function is async
          return defaultResult instanceof Promise
            ? await defaultResult
            : defaultResult
        }

        return options.defaultValue
      }
    }

    return descriptor
  }
}
