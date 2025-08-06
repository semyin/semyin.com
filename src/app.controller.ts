import { Controller, Get, Param } from "@nestjs/common";

@Controller()
export class AppController {

  @Get("/api/status")
  async status() {
    return {
      msg: 'status ok',
      time: new Date().getTime()
    }
  }

	@Get("/api/hello")
	async hello() {
		return {
			msg: 'hello world'
		}
	}

	@Get("/api/home")
	async home() {
		return {
			msg: 'This is home page data from backend'
		}
	}

	@Get("/api/about")
	async about() {
		return {
			msg: 'Another page about data from backend'
		}
	}

	@Get("/api/detail/:id")
	async detail(@Param("id") id: string) {
		return {
			msg: 'Another page id = ' + id + ' detail data from backend'
		}
	}
}
